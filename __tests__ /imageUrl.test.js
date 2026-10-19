import { Profiler } from 'react';
import { render } from '@testing-library/react-native';
import ListSummary from '../components/ListSummary';

const ITEMS = [{ id: '1', name: 'Milk', done: true }, { id: '2', name: 'Eggs', done: false }];

test('React Profiler reports how long the summary takes to render', () => {
  const durations = [];
  jest.spyOn(console, 'log').mockImplementation(() => {});
  render(
    <Profiler id="ListSummary" onRender={(id, phase, actualDuration) => durations.push(actualDuration)}>
      <ListSummary items={ITEMS} />
    </Profiler>
  );
  console.info('PROFILER mount actualDuration ms:', durations[0].toFixed(1));
  // 40 ms of simulated work, so the render cannot be faster than that.
  expect(durations[0]).toBeGreaterThanOrEqual(39);
});