import AsyncStorage from '@react-native-async-storage/async-storage';

// Harmless preferences belong in AsyncStorage. Secrets never do.
const LAST_EMAIL_KEY = 'shopfront.lastEmail';

export async function loadLastEmail() {
  try {
    return (await AsyncStorage.getItem(LAST_EMAIL_KEY)) ?? '';
  } catch (error) {
    return '';
  }
}

export async function saveLastEmail(email) {
  try {
    await AsyncStorage.setItem(LAST_EMAIL_KEY, email);
  } catch (error) {
    // Not being able to remember an email address is never worth an error message.
  }
}