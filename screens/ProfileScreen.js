import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, Avatar, Button, Chip, Text } from 'react-native-paper';
import CameraModal from '../components/CameraModal';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import {
  selectAvatarUploading,
  selectAvatarUri,
  selectAvatarWaiting,
  sendPendingAvatar,
  submitAvatar,
} from '../store/profileSlice';
import { colors, spacing } from '../theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const dispatch = useDispatch();
  const avatarUri = useSelector(selectAvatarUri);
  const waiting = useSelector(selectAvatarWaiting);
  const uploading = useSelector(selectAvatarUploading);
  const [role, setRole] = useState(null);
  const [message, setMessage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);

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

  // Queue the photo and try to send it. The store keeps it safe if the phone is offline.
  const savePhoto = async (asset) => {
    const result = await dispatch(submitAvatar(asset));

    if (sendPendingAvatar.fulfilled.match(result)) {
      setMessage('Photo uploaded.');
    } else if (result.payload?.retry) {
      setMessage('Saved on this phone. It will upload when you are back online.');
    } else if (result.payload) {
      setMessage(result.payload.message);
    }
  };

  const choosePhoto = async () => {
    setMessage(null);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      await savePhoto(result.assets[0]);
    }
  };

  const handleCapture = (asset) => {
    setCameraOpen(false);
    setMessage(null);
    savePhoto(asset);
  };

  const initial = (user?.email ?? '?').charAt(0).toUpperCase();

  return (
    <View style={styles.screen}>
      {avatarUri ? (
        <Avatar.Image size={96} source={{ uri: avatarUri }} />
      ) : (
        <Avatar.Text size={96} label={initial} />
      )}
      <Text variant="titleMedium">{user?.email}</Text>
      {role && <Chip compact>{role}</Chip>}
      <View style={styles.row}>
        <Button mode="outlined" icon="image" onPress={choosePhoto} disabled={uploading}>
          Choose photo
        </Button>
        <Button mode="outlined" icon="camera" onPress={() => setCameraOpen(true)} disabled={uploading}>
          Take photo
        </Button>
      </View>
      {uploading && <ActivityIndicator />}
      {waiting && !uploading && (
        <Text style={styles.message}>Waiting to upload. Will retry when you are online.</Text>
      )}
      {message && <Text style={styles.message}>{message}</Text>}
      <Button mode="contained" onPress={signOut} style={styles.button}>
        Sign out
      </Button>
      <CameraModal
        visible={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCapture}
      />
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
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  message: {
    color: colors.muted,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.lg,
  },
});