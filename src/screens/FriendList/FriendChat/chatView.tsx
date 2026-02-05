import {useState,} from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useChatViewModel } from './ChatViewModel';


export function ChatView({ chatId, onBack }: { chatId: string, onBack: () => void }) {

    const { messages, sendMessage, currentUserUid } = useChatViewModel(chatId);
    const [text, setText] = useState('');

    const handleSend = async () => {
        await sendMessage(text);
        setText('');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBack}>
                <Text style={styles.back}>← Back</Text>
            </TouchableOpacity>

            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[
                        styles.message,
                        item.senderId === currentUserUid
                            ? styles.ownMessage
                            : styles.otherMessage,
                        ]}>
                        <Text>{item.text}</Text>
                    </View>
                )}
            />

        <View style={styles.inputRow}>
            <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Type a message..."
                style={styles.input}
            />
            <TouchableOpacity onPress={handleSend}>
            <Text style={styles.send}>Send</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

export default ChatView;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    back: { fontSize: 18, marginBottom: 12, color: '#007AFF' },
    message: { padding: 10, marginVertical: 4, borderRadius: 8, maxWidth: '80%' },
    ownMessage: { backgroundColor: '#8690c7', alignSelf: 'flex-end' },
    otherMessage: { backgroundColor: '#EEE', alignSelf: 'flex-start' },
    inputRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 8 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8},
    send: { fontSize: 16, color: '#007AFF' },
});