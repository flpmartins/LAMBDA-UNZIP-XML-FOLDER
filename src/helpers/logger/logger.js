const winston = require('winston');

const configLog = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'magenta',
  },
  transports: [
    new winston.transports.File({
      filename: './commercial-performance-report-cubo-get-all-requests.log',
      maxFiles: 5,
      maxsize: 10000000,
      tailable: true,
      level: 'error',
    }),
  ],
};

configLog.transports.push(
  new winston.transports.Console({
    colorize: true,
    level: 'debug',
    timestamp: () => new Date().toJSON(),
    formatter: (options) => {
      const hasMeta = Object.keys(options.meta).length > 0;
      const hasMessage = options.message !== '';
      const message = hasMessage ? options.message : undefined;
      const logData = hasMeta ? options.meta : undefined;
      return JSON.stringify({
        message,
        logData,
      });
    },
  })
);

const formattedMessage = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...args } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
    }`;
  })
);

winston.addColors(configLog.colors);

const logger = winston.createLogger({
  transports: configLog.transports,
  levels: configLog.levels,
  format: formattedMessage,
});

module.exports = logger;
