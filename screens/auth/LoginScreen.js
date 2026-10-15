import { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { parseApiError } from '../../lib/errors';
import { colors, spacing } from '../../theme';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const canSubmit = email.trim() !== '' && password !== '' && !submitting;

  const handleSubmit = async () => {
    setFormError('');
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      setFormError(parseApiError(error).message);
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text variant="headlineMedium" style={styles.title}>
          Welcome back
        </Text>
        <Text style={styles.subtitle}>Sign in to continue shopping.</Text>

        <TextInput
          mode="outlined"
          label="Email"
          accessibilityLabel="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          mode="outlined"
          label="Password"
          accessibilityLabel="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              onPress={() => setShowPassword((value) => !value)}
            />
          }
        />

        <HelperText type="error" visible={formError !== ''}>
          {formError}
        </HelperText>

        <Button mode="contained" onPress={handleSubmit} disabled={!canSubmit} loading={submitting}>
          Sign in
        </Button>
        <Button onPress={() => navigation.navigate('Register')}>Create an account</Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  title: {
    color: colors.primary,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.muted,
    marginBottom: spacing.sm,
  },
});