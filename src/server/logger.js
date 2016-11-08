import winston from 'winston';

// slightly modified version of winston serializer to match talisker style
// http://talisker.readthedocs.io/en/latest/logging.html#log-format
export const serialize = (obj, key) => {
  // symbols cannot be directly casted to strings
  if (typeof key === 'symbol') {
    key = key.toString();
  }
  if (typeof obj === 'symbol') {
    obj = obj.toString();
  }

  if (obj === null) {
    obj = 'null';
  }
  else if (obj === undefined) {
    obj = 'undefined';
  }
  else if (obj === false) {
    obj = 'false';
  }

  if (key) {
    key = key
      .replace(/ /g, '_')
      .replace(/=/g, '')
      .replace(/"/g, '');
  }

  if (typeof obj !== 'object') {
    if (obj.split(' ').length > 1) {
      obj = `"${obj}"`;
    }
    return key ? key + '=' + obj : obj;
  }

  if (obj instanceof Buffer) {
    return key ? key + '=' + obj.toString('base64') : obj.toString('base64');
  }

  let msg = '';
  const keys = Object.keys(obj);
  const length = keys.length;

  for (let i = 0; i < length; i++) {
    if (Array.isArray(obj[keys[i]])) {
      msg += keys[i] + '=[';

      for (let j = 0, l = obj[keys[i]].length; j < l; j++) {
        msg += serialize(obj[keys[i]][j]);
        if (j < l - 1) {
          msg += ', ';
        }
      }

      msg += ']';
    }
    else if (obj[keys[i]] instanceof Date) {
      msg += keys[i] + '="' + obj[keys[i]];
    }
    else {
      msg += serialize(obj[keys[i]], keys[i]);
    }

    if (i < length - 1) {
      msg += ', ';
    }
  }

  return msg;
};

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

winston.addColors(customLevels.colors);

winston.loggers.add('app', {
  console: {
    label: 'app',
    levels: customLevels.levels,
    colorize: true,
    timestamp: function() {
      return new Date().toISOString()
        .replace(/T/, ' ');
    },
    formatter: function(options) {
      return `${options.timestamp()} ${options.level.toUpperCase()} \
${options.label} \
"${(options.message ? options.message : '')}" \
${(options.meta && Object.keys(options.meta).length ? serialize(options.meta) : '' )}`.trim();
    },
    stderrLevels: ['info']
  }
});

export default winston;
