import winston from 'winston';

const customLevels = {
  levels: {
    debug: 0,
    info: 1
  },
  colors: {
    debug: 'red',
    info: 'blue'
  }
};

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      levels: customLevels.levels,
      colorize: true,
      timestamp: function() {
        return new Date().toISOString()
          .replace(/T/, ' ');
      },
      formatter: function(options) {
        return `${options.timestamp()} ${options.level.toUpperCase()} \
${(options.message ? options.message : '')} \
${(options.meta && Object.keys(options.meta).length ? JSON.stringify(options.meta) : '' )}`;
      },
      stderrLevels: ['info']
    })
  ]
});

winston.addColors(customLevels.colors);

export default logger;
