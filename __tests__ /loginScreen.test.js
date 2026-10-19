import { render, screen, userEvent } from '@testing-library/react-native';
import LoginScreen from '../screens/auth/LoginScreen';

const mockSignIn = jest.fn();
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ signIn: mockSignIn }),
}));

const navigation = { navigate: jest.fn() };

beforeEach(() => mockSignIn.mockReset());

test('the Sign in button stays disabled until both fields are filled', async () => {
  const user = userEvent.setup();
  render(<LoginScreen navigation={navigation} />);

  expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled();

  await user.type(screen.getByLabelText('Email'), 'trainee@shopfront.test');
  await user.type(screen.getByLabelText('Password'), 'secret123');

  expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled();
});

test('submitting calls signIn with the trimmed email and the password', async () => {
  mockSignIn.mockResolvedValue();
  const user = userEvent.setup();
  render(<LoginScreen navigation={navigation} />);

  await user.type(screen.getByLabelText('Email'), '  trainee@shopfront.test ');
  await user.type(screen.getByLabelText('Password'), 'secret123');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(mockSignIn).toHaveBeenCalledWith('trainee@shopfront.test', 'secret123');
});

test('a server error is shown under the form', async () => {
  mockSignIn.mockRejectedValue({
    response: { data: { error: { message: 'Invalid email or password' } } },
  });
  const user = userEvent.setup();
  render(<LoginScreen navigation={navigation} />);

  await user.type(screen.getByLabelText('Email'), 'trainee@shopfront.test');
  await user.type(screen.getByLabelText('Password'), 'wrong');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(await screen.findByText('Invalid email or password')).toBeTruthy();
});