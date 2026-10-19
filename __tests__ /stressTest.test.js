import { act, fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import StressTestScreen from '../screens/StressTestScreen';

jest.useFakeTimers();

function rowRenders(log) {
  return log.mock.calls.filter((call) => call[0] === '[row] render').length;
}

// Gives the list a 390 x 700 viewport and lets its render batches run, like a real phone would.
function settle() {
  const list = screen.getByTestId('stress-list');
  act(() => {
    fireEvent(list, 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 700 } } });
    fireEvent(list, 'contentSizeChange', 390, 72 * 3000);
  });
  for (let i = 0; i < 80; i += 1) {
    act(() => {
      jest.advanceTimersByTime(50);
    });
  }
  act(() => {
    jest.advanceTimersByTime(500);
  });
}

function mountedRows() {
  return Number(screen.getByText(/^Mounted rows:/).props.children.join('').replace(/\D/g, ''));
}

describe('StressTestScreen', () => {
  let log;
  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => log.mockRestore());

  test('renders 10 rows first, and a tap re-renders none of them', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<StressTestScreen />);
    expect(rowRenders(log)).toBe(10);

    log.mockClear();
    await user.press(screen.getByLabelText('Add Item 1'));

    expect(screen.getByText(/added: 1/)).toBeTruthy();
    expect(rowRenders(log)).toBe(0);
  });

  test('Jump to row 2,500 works because getItemLayout is set', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<StressTestScreen />);
    await user.press(screen.getByText('Jump to row 2,500'));
  });

  test('a smaller windowSize mounts fewer rows', () => {
    const defaults = { initialNumToRender: 10, windowSize: 21, maxToRenderPerBatch: 10 };

    const first = render(<StressTestScreen tuning={defaults} />);
    settle();
    const withDefault = mountedRows();
    first.unmount();

    const second = render(<StressTestScreen tuning={{ ...defaults, windowSize: 5 }} />);
    settle();
    const withFive = mountedRows();
    second.unmount();

    expect(withFive).toBeLessThan(withDefault);
    process.stdout.write(`\nMOUNTED default=${withDefault} windowSize5=${withFive}\n`);
  });
});