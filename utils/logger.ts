type LogLevel = 'info' | 'error' | 'warning';

export const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string) => console.error(`[ERROR] ${message}`),
  warning: (message: string) => console.warn(`[WARNING] ${message}`),
}; 