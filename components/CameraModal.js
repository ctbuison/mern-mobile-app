import { useEffect, useRef, useState } from 'react';
import { AppState, Linking, Modal, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ActivityIndicator, Button, IconButton, Text } from 'react-native-paper';
import { colors, spacing } from '../theme';

// A full-screen camera. It calls onCapture({ uri, mimeType }) with the photo, or onClose() if the user backs out.
export default function CameraModal({ visible, onClose, onCapture }) {
  const [permission, requestPermission, refreshPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('front');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');

  // After a trip to the Settings app, look at the permission again when the user comes back.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshPermission();
      }
    });
    return () => subscription.remove();
  }, [refreshPermission]);

  const takePhoto = async () => {
    if (busy || !cameraRef.current) {
      return;
    }
    setBusy(true);
    setProblem('');
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      onCapture({ uri: photo.uri, mimeType: 'image/jpeg' });
    } catch (error) {
      setProblem('Could not take the photo. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const flipCamera = () => {
    setFacing((current) => (current === 'front' ? 'back' : 'front'));
  };

  let body;

  if (!permission) {
    // The saved answer is still being read.
    body = <ActivityIndicator color={colors.surface} />;
  } else if (!permission.granted) {
    body = (
      <View style={styles.centered}>
        <Text variant="titleMedium" style={styles.light}>
          Camera access is needed
        </Text>
        <Text style={styles.light}>
          Shopfront uses the camera to take your profile photo. Nothing is taken until you press
          the shutter button.
        </Text>
        {permission.canAskAgain ? (
          <Button mode="contained" onPress={requestPermission}>
            Allow camera
          </Button>
        ) : (
          <>
            <Text style={styles.light}>
              Camera access was turned off. You can turn it back on in the Settings app.
            </Text>
            <Button mode="contained" onPress={() => Linking.openSettings()}>
              Open Settings
            </Button>
          </>
        )}
        <Button mode="text" textColor={colors.surface} onPress={onClose}>
          Not now
        </Button>
      </View>
    );
  } else {
    body = (
      <>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          onMountError={() =>
            setProblem('No camera is available on this device. The Simulator has none.')
          }
        />
        {problem !== '' && <Text style={styles.problem}>{problem}</Text>}
        <View style={styles.controls}>
          <IconButton
            icon="close"
            iconColor={colors.surface}
            size={28}
            accessibilityLabel="Close camera"
            onPress={onClose}
          />
          <IconButton
            icon="camera"
            mode="contained"
            size={36}
            disabled={busy}
            accessibilityLabel="Take photo"
            onPress={takePhoto}
          />
          <IconButton
            icon="camera-flip-outline"
            iconColor={colors.surface}
            size={28}
            accessibilityLabel="Switch camera"
            onPress={flipCamera}
          />
        </View>
      </>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.screen}>{body}</View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  centered: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  light: {
    color: colors.surface,
    textAlign: 'center',
  },
  problem: {
    position: 'absolute',
    top: 80,
    color: colors.surface,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  controls: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});