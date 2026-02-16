import { useEffect, useState, useRef, useCallback } from "react";
import { Message } from "../../../Models/Chat";
import { collection, query, doc, updateDoc, onSnapshot, orderBy, serverTimestamp, addDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import { useAuth } from "../../../context/AuthContext";
import { handleReportSubmit, useChatClosed, useHasReported } from '../../../Services/Reports';

export const useChatViewModel = (chatId: string) => {
    const { user } = useAuth();
    const currentUserUid = user?.uid;
    const [messages, setMessages] = useState<Message[]>([]);
    const otherUserNameRef = useRef<string>('');

    const chatClosed = useChatClosed(chatId);
    const hasReported = useHasReported(chatId, currentUserUid);

    const resetUnreadCount = async () => {
        if (!currentUserUid || !chatId) return;
        const chatRef = doc(db, 'chats', chatId);

        try {
            await updateDoc(chatRef, {
                [`unread.${currentUserUid}`]: 0,
            });
        } catch (err) {
            console.error('Failed to reset unread count', err);
        }
    };

    useEffect(() => {
        if (!chatId) return;

        const q = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            
            setMessages(msgs);
            resetUnreadCount();
        });

        return unsubscribe;
    }, [chatId, currentUserUid]);

    const sendMessage = async (text: string) => {
        if (!currentUserUid || !chatId) return;

        await addDoc(collection(db, 'chats', chatId, 'messages'), {
            senderId: currentUserUid,
            text,
            createdAt: serverTimestamp(),
        });

        const chatRef = doc(db, 'chats', chatId);
        try {
            const chatSnap = await getDoc(chatRef);
            const participants: string[] = chatSnap.exists() ? (chatSnap.data() as any).participants || [] : [];

            const updates: any = {
                lastMessage: text,
                updatedAt: serverTimestamp(),
            };

            participants.forEach(uid => {
                if (uid !== currentUserUid) {
                    updates[`unread.${uid}`] = increment(1);
                }
            });

            await updateDoc(chatRef, updates);
        } catch (err) {
            console.error('Failed to update chat unread counts', err);
        }
    }

    return {
        messages,
        sendMessage,
        currentUserUid,
        handleReportSubmit,
        chatClosed,
        hasReported,
        setOtherUserName: useCallback((name: string) => {
            otherUserNameRef.current = name;
        }, [])
    }

}