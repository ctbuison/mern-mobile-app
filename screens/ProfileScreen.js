import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Chip, Text } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { setTokens } from '../lib/tokenStore';
import { colors, spacing } from '../theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [role, setRole] = useState(null);

  const loadProfile = useCallback(async () => {
    try {
      const response = await api.get('/auth/profile');
      setRole(response.data.data.role);
    } catch (error) {
      console.log('Could not load profile:', error.message);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // TEMPORARY (Module 7, Phase 6): ruin both tokens, then make a request.
  const expireSession = () => {
    setTokens({ accessToken: 'junk', refreshToken: 'junk' });
    loadProfile();
  };
  const initial = (user?.email ?? '?').charAt(0).toUpperCase();

  return (
    <View style={styles.screen}>
      <Avatar.Text size={72} label={initial} />
      <Text variant="titleMedium">{user?.email}</Text>
      {role && <Chip compact>{role}</Chip>}
      <Button mode="contained" onPress={signOut} style={styles.button}>
        Sign out
      </Button>
      <Button onPress={expireSession}>Expire session (dev)</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  button: {
    marginTop: spacing.lg,
  },
});