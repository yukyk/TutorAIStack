export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');

  if (!origin) return true;

  const allowedOrigins = [
    'http://localhost:4000',
    'http://localhost:3000',
    'https://tutor-ai-stack.vercel.app',
    'https://unsolve.app',
  ];

  return allowedOrigins.some(allowed => origin.startsWith(allowed));
}
