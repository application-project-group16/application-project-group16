import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationPayload {
  senderName: string;
  messagePreview: string;
  senderId: string;
  timestamp: number;
}

export const sendMessageNotification = async (payload: NotificationPayload) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Message from ${payload.senderName}`,
        body: payload.messagePreview,
        data: {
          senderId: payload.senderId,
          timestamp: payload.timestamp,
        },
        sound: 'default',
        badge: 1,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to request notification permissions:', error);
    return false;
  }
};