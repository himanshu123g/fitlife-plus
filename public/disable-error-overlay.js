// Disable React error overlay for specific errors
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    // Suppress ZegoCloud cleanup errors
    if (
      args[0]?.toString().includes('createSpan') ||
      args[0]?.toString().includes('Cannot read properties of null')
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  // Prevent error overlay from showing for these errors
  window.addEventListener('error', (event) => {
    if (
      event.message?.includes('createSpan') ||
      event.message?.includes('Cannot read properties of null')
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason?.message?.includes('createSpan') ||
      event.reason?.message?.includes('Cannot read properties of null')
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });
}
