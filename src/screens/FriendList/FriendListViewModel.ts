import { useEffect, useState } from 'react';
import { User } from '../../Models/User';
import { db, collection, getDoc, doc, query, where, onSnapshot } from '../../firebase/Config';
import { getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

interface Friend extends User {
    uid: string;
    unreadCount?: number;
    lastMessageTime?: any;
}

export const useFriendListViewModel = () => {
    const { user } = useAuth();
    const currentUserUid = user?.uid;

    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {

    if (!currentUserUid) return;
    const q = query(
        collection(db, 'matches'),
        where('users', 'array-contains', currentUserUid)

    );

    const unsubscribe = onSnapshot(q, async snapshot => {
        const friendPromises = snapshot.docs.map(async matchDoc => {
            const users = matchDoc.data().users as string[]
            const friendUid = users.find(uid => uid !== currentUserUid);
            if (!friendUid) return null;

            const profileSnap = await getDoc(doc(db, 'users', friendUid));
            if (!profileSnap.exists()) return null;

            let unreadCount = 0;
            let lastMessageTime: any = null;

            try {
                const chatsQuery = query(
                    collection(db, 'chats'),
                    where('participants', 'array-contains', currentUserUid)
                );

                const chatsSnap = await getDocs(chatsQuery);
                const chatDoc = chatsSnap.docs.find(d => {
                    const participants = d.data().participants as string[];
                    return participants.includes(friendUid) && participants.length === 2;
                });

                if (chatDoc) {
                    const chatData: any = chatDoc.data();
                    unreadCount = (chatData.unread && chatData.unread[currentUserUid]) || 0;
                    lastMessageTime = chatData.updatedAt || null;
                }
            } catch (err) {
                console.error('Failed to fetch chat for friend list', err);
            }

            return {
                uid: friendUid,
                unreadCount,
                lastMessageTime,
                ...(profileSnap.data() as User)
            }
        })

        const resolvedFriends = (await Promise.all(friendPromises)).filter(Boolean) as Friend[];

        const uniqueFriends = Array.from(
        new Map(resolvedFriends.map(friend => [friend.uid, friend])).values()
        );

        setFriends(uniqueFriends)
    });

    return unsubscribe;

}, [currentUserUid]);

    return {
        friends
    };
}

