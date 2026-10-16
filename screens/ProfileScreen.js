import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Avatar, Button, Chip, Text } from 'react-native-paper';
import CameraModal from '../components/CameraModal';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { getErrorMessage } from '../lib/errors';
import { uploadAvatar } from '../services/uploads';
import { colors, spacing } from '../theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [role, setRole] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [uploading, setUploading] = useState(false);
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

  // Show the photo straight away, then upload it and swap in the server's copy.
  const savePhoto = async (asset) => {
    setPhotoUri(asset.uri);
    setUploading(true);

    try {
      const url = await uploadAvatar(asset);
      setPhotoUri(url);
      setMessage('Photo uploaded.');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setUploading(false);
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
      {photoUri ? (
        <Avatar.Image size={96} source={{ uri: photoUri }} />
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
  },
  button: {
    marginTop: spacing.lg,
  },
});