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