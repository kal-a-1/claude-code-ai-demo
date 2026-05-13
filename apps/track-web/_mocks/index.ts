async function initMocks() {
  console.log('Mocking APIs enabled');
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen({
      onUnhandledRequest: 'bypass',
    });
  } else {
    const { worker } = await import('./browser');
    worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true,
    });
  }
}

initMocks();

export {};
