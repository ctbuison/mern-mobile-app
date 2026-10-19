import { Text } from 'react-native';
import { act, render, screen } from '@testing-library/react-native';
import useElapsedSeconds from '../hooks/useElapsedSeconds';

function Elapsed() {
  const seconds = useElapsedSeconds();
  return <Text>{seconds}s</Text>;
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test('counts up while mounted', () => {
  render(<Elapsed />);
  act(() => jest.advanceTimersByTime(3000));
  expect(screen.getByText('3s')).toBeTruthy();
});

test('leaves no timer running after the screen unmounts', () => {
  const { unmount } = render(<Elapsed />);
  unmount();
  console.info('TIMERS after unmount:', jest.getTimerCount());
  expect(jest.getTimerCount()).toBe(0);
});