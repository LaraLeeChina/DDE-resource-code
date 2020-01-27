var log4js = require('log4js');

log4js.configure({
  appenders: {
    logFile: {
      type: "dateFile",
      filename: __dirname + '/logs/dde.log',
      alwaysIncludePattern: true,
      //pattern: ".yyyy-MM-dd-hh:mm:ss.log",
      encoding: 'utf-8',
      maxLogSize: 256*1024*10,
      backups: 3,
    },
    logConsole: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['logFile'],  
      level: 'info'            
    },
    logFile: {
      appenders: ['logFile'],
      level: 'info'
    },
    logConsole: {
      appenders: ['logConsole'],
      level: log4js.levels.INFO
    }
  }
});

module.exports = log4js.getLogger('logFile');
