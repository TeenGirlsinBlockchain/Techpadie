type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  requestId?: string;
  action?: string;
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL =
  LOG_LEVELS[(process.env.LOG_LEVEL as LogLevel) || 'info'] ?? 1;

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= CURRENT_LEVEL;
}

function formatEntry(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
) {
  const entry: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (context) {
    Object.assign(entry, context);
  }

  if (error) {
    entry.error = error.message;
    entry.stack = error.stack;
  }

  return JSON.stringify(entry);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (shouldLog('debug')) {
      console.debug(formatEntry('debug', message, context));
    }
  },

  info(message: string, context?: LogContext) {
    if (shouldLog('info')) {
      console.info(formatEntry('info', message, context));
    }
  },

  warn(message: string, context?: LogContext) {
    if (shouldLog('warn')) {
      console.warn(formatEntry('warn', message, context));
    }
  },

  error(message: string, error: Error, context?: LogContext) {
    if (shouldLog('error')) {
      console.error(formatEntry('error', message, context, error));
    }
  },
};