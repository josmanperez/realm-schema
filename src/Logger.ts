interface LogLevels {
  [level: string]: number;
}

export enum LogType {
  trace = 'trace',
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
  silent = 'silent'
}

const levels: LogLevels = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  silent: 5
};

const logLevel = levels[process.env.LOG_LEVEL as LogType || 'info'];

export class Logger {
  static log(level: LogType, message: string): void {
    if (levels[level] >= logLevel) {
      (console as Record<string, any>)[level](message);
    }
  }
}