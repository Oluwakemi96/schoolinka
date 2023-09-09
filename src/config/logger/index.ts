import winston from 'winston';

const { SCHOOLINKA_NODE_ENV } = process.env;

const myformat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.level} ${info.message || info.stack}`
    )
  );
  
  /**
   * Winston logger
   */
  type loggerLevel = 'warning' | 'error' | 'info'

  const devLogger = winston.createLogger({
    // level: K loggerLevel,
    transports: [
      new winston.transports.File({
        filename: 'logs/server.log',
        maxsize: 500,
        format: myformat,
      }),
      new winston.transports.Console({
        format: myformat,
      }),
    ],
  });
  
  const prodLogger = winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: 'logs/server.log',
        maxsize: 500,
        format: myformat,
      }),
    ],
  });
//   type loggerLevel = 'warning' | 'error' | 'info'
  

// export globalThis = true; 

export default function logger<T>(level: loggerLevel, logInfo: T) {
    if (SCHOOLINKA_NODE_ENV === 'development') {
      return devLogger.log(level, logInfo);
    }
    return prodLogger.log(level, logInfo);
}
  