import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';

function Counter() {
  const [n, setN] = useState(0);
  return (
    <Pressable onPress={() => setN(n + 1)}>
      <Text>count: {n}</Text>
    </Pressable>
  );
}

test('counter increments on press', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  await user.press(screen.getByText('count: 0'));
  expect(screen.getByText('count: 1')).toBeTruthy();
});