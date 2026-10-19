// Pretends to be expensive work by keeping the JavaScript thread busy for a number of milliseconds.
// Real apps get slow in the same way: a long calculation that blocks the thread so taps and typing wait.
export function burnCpu(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // busy-wait
  }
}