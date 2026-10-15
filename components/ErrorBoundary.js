import { Component } from 'react';
import ErrorState from './ErrorState';

// Catches errors thrown while React is RENDERING anything below it, and shows a fallback instead
// of a blank screen. It does not catch errors in event handlers or in async code (try/catch does).
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // A real app would send this to a crash-reporting service.
    console.log('[ErrorBoundary]', error.message);
    console.log(info.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorState
          title="Something went wrong"
          message="The app ran into an unexpected problem. Try again, and restart the app if it keeps happening."
          onRetry={this.reset}
        />
      );
    }
    return this.props.children;
  }
}