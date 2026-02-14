import {useState,} from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import { useChatViewModel } from './ChatViewModel';
import { handleReportSubmit, useChatClosed, useHasReported } from '../../../Services/Reports';

export function ChatView({ chatId, onBack }: { chatId: string, onBack: () => void }) {

    const { messages, sendMessage, currentUserUid } = useChatViewModel(chatId);
    const [text, setText] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');

    const chatClosed = useChatClosed(chatId);
    const hasReported = useHasReported(chatId, currentUserUid);

    const handleSend = async () => {
        await sendMessage(text);
        setText('');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBack}>
                <Text style={styles.back}>← Back</Text>
            </TouchableOpacity>

            {messages.some(m => m.senderId !== currentUserUid) && (
                hasReported ? (
                    <Text style={{ color: 'red', marginBottom: 10, fontWeight: '600' }}>
                        User has been blocked
                    </Text>
                ) : (
                    <TouchableOpacity
                        onPress={() =>
                            Alert.alert(
                                'Report user',
                                'Are you sure you want to report this user? This will also block the user and close the chat.',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Continue',
                                        style: 'destructive',
                                        onPress: () => setShowReportModal(true),
                                    },
                                ]
                            )
                        }
                    >
                        <Text style={{ color: 'red', marginBottom: 10 }}>
                            Report user
                        </Text>
                    </TouchableOpacity>
                )
            )}

                <Modal visible={showReportModal} transparent animationType="slide">
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <View style={{ backgroundColor: '#fff', margin: 20, padding: 16, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>Report user</Text>

                        <TextInput
                            placeholder="Explain why you are reporting this user"
                            value={reportReason}
                            onChangeText={setReportReason}
                            multiline
                            style={{ borderWidth: 1, borderColor: '#ccc', marginTop: 10, padding: 8 }}
                        />

                        <TouchableOpacity
                            style={{ marginTop: 12 }}
                            onPress={() => {
                                if (!reportReason.trim()) {
                                    Alert.alert('Please explain why you are reporting this user.');
                                    return;
                                }

                                handleReportSubmit({
                                    currentUserUid,
                                    chatId,
                                    messages,
                                    reportReason,
                                    onBack
                                });
                            }}
                        >
                            <Text style={{ color: 'red', fontWeight: '600' }}>Submit report</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShowReportModal(false)}>
                            <Text style={{ marginTop: 8 }}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                </Modal>

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
                    placeholder={chatClosed ? "Chat closed" : "Type a message..."}
                    style={styles.input}
                    editable={!chatClosed}
                />
                <TouchableOpacity onPress={handleSend} disabled={chatClosed}>
                    <Text style={{ ...styles.send, color: chatClosed ? '#999' : '#007AFF' }}>Send</Text>
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