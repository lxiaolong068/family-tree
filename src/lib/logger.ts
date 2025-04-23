/**
 * 日志服务
 * 根据环境变量控制日志输出级别
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  level: LogLevel;
  enableConsole: boolean;
}

class Logger {
  private options: LoggerOptions = {
    level: 'info',
    enableConsole: true
  };

  constructor(options?: Partial<LoggerOptions>) {
    // 根据环境设置默认日志级别
    const defaultLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
    
    this.options = {
      level: options?.level || defaultLevel,
      enableConsole: options?.enableConsole ?? process.env.NODE_ENV !== 'production'
    };
  }

  /**
   * 日志级别优先级
   */
  private readonly levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  /**
   * 检查是否应该记录给定级别的日志
   */
  private shouldLog(level: LogLevel): boolean {
    return this.options.enableConsole && 
           this.levelPriority[level] >= this.levelPriority[this.options.level];
  }

  /**
   * 调试日志
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * 信息日志
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * 警告日志
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  /**
   * 错误日志
   */
  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  /**
   * 设置日志级别
   */
  setLevel(level: LogLevel): void {
    this.options.level = level;
  }

  /**
   * 启用/禁用控制台日志
   */
  enableConsole(enable: boolean): void {
    this.options.enableConsole = enable;
  }
}

// 导出单例实例
export const logger = new Logger();
