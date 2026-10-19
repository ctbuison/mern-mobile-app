// Prints one line each time a component renders. Counting these lines is the simplest profiler there is.
export function renderLog(name, detail = '') {
  if (__DEV__) {
    console.log('[render]', name, detail);
  }
}