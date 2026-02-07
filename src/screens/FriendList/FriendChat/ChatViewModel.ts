import { useEffect, useState } from "react";
import { Message } from "../../../Models/Chat";
import { collection, query, doc, updateDoc, onSnapshot, orderBy, serverTimestamp, addDoc, } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import { useAuth } from "../../../context/AuthContext";


export const useChatViewModel = (chatId: string) => {
    const { user } = useAuth();
    const currentUserUid = user?.uid;
    const [messages, setMessages] = useState<Message[]>([]);

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
        });

        return unsubscribe;
    }, [chatId]);

    const sendMessage = async (text: string) => {
        if (!currentUserUid || !chatId) return;

        await addDoc(collection(db, 'chats', chatId, 'messages'), {
            senderId: currentUserUid,
            text,
            createdAt: serverTimestamp(),
        });

        await updateDoc(doc(db, 'chats', chatId), {
            lastMessage: text,
            updatedAt: serverTimestamp(),
        });
    }

    return {
        messages,
        sendMessage,
        currentUserUid,
    }

}