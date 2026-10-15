import { OfflineError } from './network';

// Turns whatever went wrong into something a form can show.
// Returns { message, fieldErrors } where fieldErrors maps a field name to its message.
export function parseApiError(error) {
  const apiError = error.response?.data?.error;

  if (!apiError) {
    return {
      message: 'Cannot reach the server. Check your connection and try again.',
      fieldErrors: {},
    };
  }

  const fieldErrors = {};
  for (const detail of apiError.details ?? []) {
    if (detail.path && !fieldErrors[detail.path]) {
      fieldErrors[detail.path] = detail.msg;
    }
  }

  return { message: apiError.message, fieldErrors };
}

// One friendly sentence for any failed request. Screens show this in their error state.
export function getErrorMessage(error) {
  if (error instanceof OfflineError) {
    return 'You are offline. Connect to the internet and try again.';
  }
  if (!error?.isAxiosError) {
    return 'Something unexpected went wrong. Please try again.';
  }

  // No response at all: the request never reached the server, or the server never answered.
  if (!error.response) {
    return error.code === 'ECONNABORTED'
      ? 'The server took too long to answer. Please try again.'
      : 'Cannot reach the server. Check your connection and try again.';
  }

  const { status } = error.response;
  if (status === 404) return 'We could not find that item.';
  if (status === 403) return 'You do not have permission to see that.';
  if (status >= 500) return 'The server had a problem. Please try again in a moment.';
  return error.response.data?.error?.message ?? 'Something went wrong. Please try again.';
}