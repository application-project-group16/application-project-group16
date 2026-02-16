import { useState } from "react";
import { View, Text, } from 'react-native';
import ChatView  from "./chatView";
import FriendListScreen from "../FriendListView";
import { db } from "../../../firebase/Config";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";

const ChatPage = () => {

    const handleSelectFriend = async (friendUid: string) => {
        const chatId = await openChatWithFriend(friendUid);

        if (chatId){
            const userSnap = await getDoc(doc(db, 'users', friendUid));
            
            if (userSnap.exists()) {
            const friendData = userSnap.data();
            setSelectedFriendName(friendData.name || 'Unknown');
            }

            setSelectedChatId(chatId);
        }
    };
    
    const { user } = useAuth();
    const currentUserUid = user?.uid;
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [selectedFriendName, setSelectedFriendName] = useState<string | null>(null);
    const [selectedFriendImage, setSelectedFriendImage] = useState<string | null>(null);

    const openChatWithFriend = async (friendUid: string): Promise<string | null> => {
        if (!currentUserUid) { 
            return null;
        }
    try{

        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', currentUserUid),
        );

        const snap = await getDocs(q);


        const existingChat = snap.docs.find(doc => {
            const participants: string[] = doc.data().participants;
            return (
                participants.includes(friendUid) &&
                participants.length === 2
            );
        });

        if (existingChat) {;
            return existingChat.id;
        }

        const newChat = await addDoc(collection(db, 'chats'), {
            participants: [currentUserUid, friendUid],
            updatedAt: new Date(),
            lastMessage: '',
            unreadCount: 0,
        });

        return newChat.id;

    } catch (error) {
        console.error('Error opening/creating chat:', error);
        return null;
    }
    };

    return (
        <View style={{ flex: 1 }}>
            {selectedChatId ? (
                <ChatView
                    chatId={selectedChatId}
                    friendName={selectedFriendName || 'Chat'}
                    friendImage={selectedFriendImage || ''}
                    onBack={() => {
                        setSelectedChatId(null)
                        setSelectedFriendName(null)
                    }}
                />
            ) : (
                <FriendListScreen onSelectFriend={handleSelectFriend} /> 
            )}
        </View>
    );

};

export default ChatPage;
