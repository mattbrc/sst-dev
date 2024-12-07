export function onError(error: unknown) {
  let message = String(error);

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    message = String(error.message);
  }

  alert(message);
}
