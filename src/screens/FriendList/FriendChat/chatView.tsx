import { useRef, useState,} from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useChatViewModel } from './ChatViewModel';
import { handleReportSubmit, useChatClosed, useHasReported } from '../../../Services/Reports';
import { gradients } from '../../../Models/Gradient'
import { LinearGradient } from 'expo-linear-gradient';

export function ChatView({ 
    chatId, 
    friendName,
    friendImage,
    onBack 
}: { 
    chatId: string, 
    friendName: string | null,
    friendImage: string | null,
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
            <LinearGradient style={styles.container} colors={gradients.chatBackground}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack}>
                        <Text style={styles.backArrow}>‹</Text>
                    </TouchableOpacity>
                    <Image
                        source={
                            friendImage
                                ? { uri: friendImage }
                                : require('../../../assets/favicon.png')
                        }
                        style={styles.headerAvatar}
                    />

                    <Text style={styles.headerName}>
                    {friendName ?? "Chat"}
                    </Text>
                    </View>

                    {messages.some(m => m.senderId !== currentUserUid) && (
                        hasReported ? (
                            <View style={{ padding: 6, backgroundColor: '#ffcccc', borderRadius: 8 }}>
                                <Text style={styles.blockedText}>Blocked</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.reportButton}
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
                                <Text style={styles.reportButtonText}>Report</Text>
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
                renderItem={({ item }) => {
                    const isOwn = item.senderId === currentUserUid;
                    if (isOwn) {
                        return (
                            <View style={[styles.message, styles.ownMessage]}>
                                <Text style={styles.ownMessageText}>{item.text}</Text>
                                <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
                            </View>
                        );
                    }
                    
                    return (
                        <View style={styles.otherMessageRow}>
                            <Image
                                source={
                                    friendImage
                                    ? { uri: friendImage }
                                    : require('../../../assets/favicon.png')
                                } 
                                style={styles.avatar}
                            />

                        <View style={[styles.message, styles.otherMessage]}>
                            <Text style={styles.otherMessageText}>{item.text}</Text>
                            <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
                        </View>
                    </View>
                    );
                }}
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
            </LinearGradient>
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
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 8,
    },
    
    backArrow: { 
        fontSize: 35, 
        color: '#000', 
        marginRight: 8,
        lineHeight: 35,
        textAlignVertical: 'center',
        marginTop: -4,
    },

    headerName: { 
        fontSize: 20, 
        fontWeight: '600', 
        color: '#000' 
    },

    reportButton: { 
        backgroundColor: '#e53935',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },

    reportButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },

    blockedText: { 
        color: '#fff',
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

    ownMessage: { backgroundColor: '#332e2e', 
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
        color: '#000000', 
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
        justifyContent: 'space-between', 
        borderColor: '#000',
        borderTopWidth: 1,
    },

    input: { 
        flex: 1, 
        borderWidth: 2, 
        borderColor: '#696565', 
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

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },

    otherMessageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginLeft: 10,
        marginVertical: 4,
    },


});