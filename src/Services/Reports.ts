import { useState, useEffect } from 'react'
import { addDoc, collection, doc, updateDoc, arrayUnion, serverTimestamp, onSnapshot, where, query } from 'firebase/firestore'
import { db } from '../firebase/Config'
import { Alert } from 'react-native'
import { Message } from '../Models/Chat'

interface ReportUserParams {
  reporterUserId: string
  reportedUserId: string
  chatId: string
  reason: string
}

export const reportUserAndBlock = async ({
  reporterUserId,
  reportedUserId,
  chatId,
  reason,
}: ReportUserParams) => {

    await addDoc(collection(db, 'reports'), {
      reporterUserId,
      reportedUserId,
      chatId,
      reason,
      status: 'pending',
      createdAt: serverTimestamp(),
    })

    const reporterRef = doc(db, 'users', reporterUserId)
    await updateDoc(reporterRef, {
        blockedUsers: arrayUnion(reportedUserId),
    })

    const chatRef = doc(db, 'chats', chatId)
    await updateDoc(chatRef, {
      closed: true,
      updatedAt: serverTimestamp(),
    })
}

export const reportAndCloseChat = async (
  currentUserUid: string,
  otherUserId: string,
  chatId: string,
  reason: string
) => {
  if (!currentUserUid || !otherUserId || !chatId) return

  await reportUserAndBlock({
    reporterUserId: currentUserUid,
    reportedUserId: otherUserId,
    chatId,
    reason,
  })
}

export const handleReportSubmit = async (params: {
  currentUserUid: string,
  chatId: string,
  messages: Message[],
  reportReason: string,
  onBack: () => void,
}) => {
  const { currentUserUid, chatId, messages, reportReason, onBack } = params

  if (!currentUserUid || !chatId) return

  const otherUserId = messages
    .map(m => m.senderId)
    .filter(uid => uid !== currentUserUid)
    .find(Boolean);

  if (!otherUserId) {
    Alert.alert(
      'Cannot report yet',
      'You can only report a user after they have sent at least one message.'
    )
    return
  }

  await reportAndCloseChat(
    currentUserUid,
    otherUserId,
    chatId,
    reportReason
  )

  Alert.alert('Report sent successfully')
  onBack()
}

export const useChatClosed = (chatId: string) => {
  const [chatClosed, setChatClosed] = useState(false)

  useEffect(() => {
    if (!chatId) return

    const chatRef = doc(db, 'chats', chatId)

    const unsubscribe = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        setChatClosed(!!data?.closed)
      }
    });

    return () => unsubscribe()
  }, [chatId])

  return chatClosed
}

export const useHasReported = (chatId: string, currentUserUid: string) => {
  const [hasReported, setHasReported] = useState(false)

  useEffect(() => {
    if (!chatId || !currentUserUid) return

    const reportsQuery = query(
      collection(db, 'reports'),
      where('chatId', '==', chatId),
      where('reporterUserId', '==', currentUserUid)
    )

    const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
      setHasReported(snapshot.size > 0)
    })

    return () => unsubscribe()
  }, [chatId, currentUserUid])

  return hasReported
}