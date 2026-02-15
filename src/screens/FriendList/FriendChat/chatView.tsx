import { useRef, useState,} from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import { useChatViewModel } from './ChatViewModel';
import { handleReportSubmit, useChatClosed, useHasReported } from '../../../Services/Reports';
import { KeyboardAvoidingView, Platform, Keyboard } from 'react-native';

export function ChatView({ 
    chatId, 
    friendName, 
    onBack 
}: { 
    chatId: string, 
    friendName: string | null,
    onBack: () => void }) {

    const { messages, sendMessage, currentUserUid, chatClosed, hasReported } = useChatViewModel(chatId);
    const [text, setText] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const flatListRef = useRef<FlatList>(null);
    

    const handleSend = async () => {
        if (!text.trim()) return;
        
        await sendMessage(text);
        setText('');

        Keyboard.dismiss();
    };

    const formatTime = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const messageDate = new Date(date);
        messageDate.setHours(0, 0, 0, 0);
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const time = `${hours}:${minutes}`;
        
        if (messageDate.getTime() === today.getTime()) {
            return time;
        }
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const day = date.getDate();
        
        return `${month} ${day} ${time}`;
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 2 }}
            behavior={Platform.OS === 'ios' ? 'padding' : "height"}
            keyboardVerticalOffset={Platform.OS === "android" ? 80 : 0}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack}>
                        <Text style={styles.backArrow}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerName}>
                    {friendName ?? "Chat"}
                    </Text>

                    {messages.some(m => m.senderId !== currentUserUid) && (
                        hasReported ? (
                            <Text style={styles.blockedText}>Blocked</Text>
                        ) : (
                            <TouchableOpacity
                                onPress={() =>
                                    Alert.alert(
                                        'Report user',
                                        'Are you sure you want to report this user?',
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
                                <Text style={styles.reportButton}>Report</Text>
                            </TouchableOpacity>
                        )
                    )}
                </View>
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
                ref={flatListRef}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[
                        styles.message,
                        item.senderId === currentUserUid
                            ? styles.ownMessage
                            : styles.otherMessage,
                        ]}>
                        <Text style={item.senderId === currentUserUid ? styles.ownMessageText : styles.otherMessageText}>
                            {item.text}
                        </Text>
                        <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
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
                <TouchableOpacity onPress={handleSend} disabled={chatClosed || !text.trim()}>
                    <Text style={{ ...styles.send, color: chatClosed || !text.trim() ? '#999' : '#ffffff' }}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
        </KeyboardAvoidingView>
    );
};

export default ChatView;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 0, 
        backgroundColor: '#fff' 
    },

    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 0,
        gap: 12, 
        marginBottom: 8, 
        justifyContent: 'space-between',
        paddingHorizontal: 8, 
        backgroundColor: '#fff', 
        paddingBottom: 8,
        borderBottomWidth: 1, 
        borderBottomColor: '#000000',
    },
    
    backArrow: { 
        fontSize: 45,
        marginLeft: 4, 
        color: '#000' 
    },

    headerName: { 
        fontSize: 20, 
        fontWeight: '600', 
        color: '#000' 
    },

    reportButton: { 
        fontSize: 14,
        color: 'red' 
    },

    blockedText: { 
        color: 'red',
        fontSize: 14, 
        fontWeight: '600' 
    },

    friendName: { 
        fontSize: 18, 
        fontWeight: '600', 
        color: '#000' 
    },

    message: { padding: 10, 
        marginVertical: 4, 
        borderRadius: 10, 
        maxWidth: '80%', 
        marginLeft: 10 
    },

    ownMessage: { backgroundColor: '#000000', 
        borderRadius: 10, 
        alignSelf: 'flex-end', 
        marginRight: 10 
    },

    otherMessage: { 
        backgroundColor: '#EEE', 
        alignSelf: 'flex-start' 
    },

    ownMessageText: { 
        color: '#fff', 
        fontSize: 16 
    },

    otherMessageText: { 
        color: '#000', 
        fontSize: 16 
    },

    timestamp: { 
        fontSize: 12,
        marginTop: 4, 
        color: '#999', 
        textAlign: 'right' 
    },

    inputRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 10, 
        backgroundColor: '#fff', 
        justifyContent: 'space-between' 
    },

    input: { 
        flex: 1, 
        borderWidth: 2, 
        borderColor: '#000000', 
        borderRadius: 8, 
        padding: 8
    },

    send: { 
        fontSize: 16, 
        color: '#fff', 
        backgroundColor: '#0702ff', 
        marginLeft: 3, 
        padding: 6, 
        borderRadius: 10 
    },


});