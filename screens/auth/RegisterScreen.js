import { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { parseApiError } from '../../lib/errors';
import { colors, spacing } from '../../theme';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const canSubmit = email.trim() !== '' && password !== '' && !submitting;

  const handleSubmit = async () => {
    setFormError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      await signUp(email.trim(), password);
    } catch (error) {
      const parsed = parseApiError(error);
      setFieldErrors(parsed.fieldErrors);
      // A validation failure is explained under the fields; anything else goes in the form error.
      setFormError(Object.keys(parsed.fieldErrors).length > 0 ? '' : parsed.message);
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
          Create your account
        </Text>

        <TextInput
          mode="outlined"
          label="Email"
          accessibilityLabel="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          error={Boolean(fieldErrors.email)}
        />
        <HelperText type="error" visible={Boolean(fieldErrors.email)}>
          {fieldErrors.email}
        </HelperText>

        <TextInput
          mode="outlined"
          label="Password"
          accessibilityLabel="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          error={Boolean(fieldErrors.password)}
        />
        <HelperText type={fieldErrors.password ? 'error' : 'info'} visible>
          {fieldErrors.password ?? 'At least 8 characters.'}
        </HelperText>

        <HelperText type="error" visible={formError !== ''}>
          {formError}
        </HelperText>

        <Button mode="contained" onPress={handleSubmit} disabled={!canSubmit} loading={submitting}>
          Create account
        </Button>
        <Button onPress={() => navigation.goBack()}>I already have an account</Button>
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
    padding: spacing.xl,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  title: {
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
});