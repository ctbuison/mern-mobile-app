import { useEffect } from 'react';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// What to do with a notification that arrives while the app is open: show it as a banner.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Asks for permission if needed, then returns this phone's Expo push token.
// Throws an Error with a message that is safe to show on screen.
export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    throw new Error('Push notifications need a physical iPhone. The Simulator cannot receive them.');
  }

  const current = await Notifications.getPermissionsAsync();
  let granted = current.granted;
  if (!granted && current.canAskAgain) {
    granted = (await Notifications.requestPermissionsAsync()).granted;
  }
  if (!granted) {
    throw new Error('Notifications are turned off for this app. Turn them on in the Settings app.');
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    throw new Error('No Expo project ID found. Run "npx eas-cli init" in the project folder, then reload.');
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}

// Calls onReceive(notification) for every notification that arrives while the app is open.
export function useNotificationListener(onReceive) {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(onReceive);
    return () => subscription.remove();
  }, [onReceive]);
}