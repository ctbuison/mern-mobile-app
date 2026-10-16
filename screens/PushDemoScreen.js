import { useCallback, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { registerForPushNotifications, useNotificationListener } from '../lib/push';

// A trainer demo screen: get this phone's push token, then watch a notification arrive.
export default function PushDemoScreen() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [received, setReceived] = useState([]);

  const handleReceive = useCallback((notification) => {
    const { title, body } = notification.request.content;
    setReceived((current) => [`${title ?? '(no title)'}: ${body ?? ''}`, ...current]);
  }, []);

  useNotificationListener(handleReceive);

  const register = async () => {
    setError('');
    try {
      const value = await registerForPushNotifications();
      setToken(value);
      console.log('[push] token:', value);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Button title="Get my push token" onPress={register} />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      {token !== '' && (
        <View style={styles.box}>
          <Text style={styles.label}>Your token (also printed in the Metro terminal):</Text>
          <Text selectable>{token}</Text>
        </View>
      )}
      <Text style={styles.label}>Received while the app is open:</Text>
      {received.length === 0 && <Text>Nothing yet.</Text>}
      {received.map((line, index) => (
        <Text key={index}>{line}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    gap: 12,
  },
  box: {
    gap: 4,
  },
  label: {
    fontWeight: '600',
  },
  error: {
    color: '#c62828',
  },
});