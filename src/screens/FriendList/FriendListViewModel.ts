import { useEffect, useState, useRef } from 'react';
import { User } from '../../Models/User';
import { db, collection, doc, query, where, onSnapshot } from '../../firebase/Config';
import { useAuth } from '../../context/AuthContext';
import { sendMessageNotification } from '../../Services/messageNotification';

interface Friend extends User {
    uid: string;
    unreadCount?: number;
    lastMessageTime?: any;
}

export type { Friend };

export const useFriendListViewModel = () => {
    const { user } = useAuth();
    const currentUserUid = user?.uid;

    const [friends, setFriends] = useState<Friend[]>([]);
    const unsubscribersRef = useRef<Map<string, (() => void)[]>>(new Map());
    const previousMessageTimeRef = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        if (!currentUserUid) return;

        const matchesQuery = query(
            collection(db, 'matches'),
            where('users', 'array-contains', currentUserUid)
        );

        const unsubscribeMatches = onSnapshot(matchesQuery, snapshot => {
            const currentFriendUids = new Set<string>();

            snapshot.docs.forEach(matchDoc => {
                const users = matchDoc.data().users as string[];
                const friendUid = users.find(uid => uid !== currentUserUid);
                if (!friendUid) return;

                currentFriendUids.add(friendUid);

                if (!unsubscribersRef.current.has(friendUid)) {
                    const friendDocRef = doc(db, 'users', friendUid);
                    const unsubscribers: (() => void)[] = [];

                    const unsubscribeFriend = onSnapshot(friendDocRef, friendSnap => {
                        if (!friendSnap.exists()) return;

                        setFriends(prev => {
                            const existingFriend = prev.find(f => f.uid === friendUid);
                            const filtered = prev.filter(f => f.uid !== friendUid);
                            return [
                                ...filtered,
                                {
                                    uid: friendUid,
                                    unreadCount: existingFriend?.unreadCount || 0,
                                    lastMessageTime: existingFriend?.lastMessageTime || null,
                                    ...(friendSnap.data() as User)
                                }
                            ];
                        });
                    });
                    unsubscribers.push(unsubscribeFriend);

                    const chatQuery = query(
                        collection(db, 'chats'),
                        where('participants', 'array-contains', currentUserUid)
                    );

                    const unsubscribeChat = onSnapshot(chatQuery, chatSnap => {
                        const chatDoc = chatSnap.docs.find(d => {
                            const participants = d.data().participants as string[];
                            return participants.includes(friendUid) && participants.length === 2;
                        });

                        let unreadCount = 0;
                        let lastMessageTime: any = null;

                        if (chatDoc) {
                            const chatData: any = chatDoc.data();
                            unreadCount = (chatData.unread && chatData.unread[currentUserUid]) || 0;
                            lastMessageTime = chatData.updatedAt || null;
                            
                            if (unreadCount > 0) {
                                const prevTime = previousMessageTimeRef.current.get(friendUid);
                                const currentTime = lastMessageTime?.seconds ?? 0;
                                
                                if (!prevTime || currentTime > prevTime) {
                                    setFriends(prev => {
                                        const existingFriend = prev.find(f => f.uid === friendUid);
                                        if (existingFriend) {
                                            sendMessageNotification({
                                                senderName: existingFriend.name || 'Friend',
                                                messagePreview: chatData.lastMessage?.substring(0, 50) || '...',
                                                senderId: friendUid,
                                                timestamp: currentTime,
                                            });
                                        }
                                        return prev;
                                    });
                                    
                                    previousMessageTimeRef.current.set(friendUid, currentTime);
                                }
                            }
                        }

                        setFriends(prev => {
                            const existingFriend = prev.find(f => f.uid === friendUid);
                            if (!existingFriend) return prev;
                            
                            const filtered = prev.filter(f => f.uid !== friendUid);
                            return [
                                ...filtered,
                                {
                                    ...existingFriend,
                                    uid: friendUid,
                                    unreadCount,
                                    lastMessageTime
                                }
                            ];
                        });
                    });
                    unsubscribers.push(unsubscribeChat);

                    unsubscribersRef.current.set(friendUid, unsubscribers);
                }
            });

            unsubscribersRef.current.forEach((unsubscribers, friendUid) => {
                if (!currentFriendUids.has(friendUid)) {
                    unsubscribers.forEach(unsub => unsub());
                    unsubscribersRef.current.delete(friendUid);
                    setFriends(prev => prev.filter(f => f.uid !== friendUid));
                }
            });
        });

        return () => {
            unsubscribeMatches();
            unsubscribersRef.current.forEach(unsubscribers => {
                unsubscribers.forEach(unsub => unsub());
            });
            unsubscribersRef.current.clear();
        };
    }, [currentUserUid]);

    return { friends };
};

