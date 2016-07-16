(function () {

  'use strict';

  // Use these for pretty output later
  var ansi = require('ansi');
  var cursor = ansi(process.stdout);

  var levels = {
    'trace': 0,
    'debug': 1,
    'info': 2,
    'log': 3,
    'warn': 4,
    'error': 5,
    'fatal': 6,
  };

  var codes = {
    0: 'Unknown',
  };

  var activeLogLevel = 0;

  function cap (word) {
    return word.charAt(0).toUpperCase() + word.slice(1) + ': ';
  }

  function handleMessage (detail, data, code) {

    if (activeLogLevel > levels[this]) {
      return;
    }

    switch (this) {
      case 'trace':
        console.log(cap(this), detail, data);
        break;
      case 'debug':
        console.log(this, detail, data);
        break;
      case 'info':
        console.log(this, detail, data);
        break;
      case 'log':
        console.log(this, detail, data);
        break;
      case 'warn':
        console.warn(this, detail, data);
        break;
      case 'error':
        console.error(this, detail, data);
        break;
      case 'fatal':
        throw this +'\n'+ detail +'\n'+ data;
        break;
    }

    // console.log(message, data);
    // console.log(this === 'trace');
  };

  module.exports = {

    setLogLevel: function (level) {
      activeLogLevel = level;
    },

    // TODO:
    // setLogFile: function (file) {
    // },
    //


    trace: function () {
      handleMessage.apply('trace', arguments);
    },
    debug: function () {
      handleMessage.apply('debug', arguments);
    },
    info: function () {
      handleMessage.apply('debug', arguments);
    },
    log: function () {
      handleMessage.apply('debug', arguments);
    },
    warn: function () {
      handleMessage.apply('debug', arguments);
    },
    error: function () {
      handleMessage.apply('debug', arguments);
    },
    fatal: function () {
      handleMessage.apply('fatal', arguments);
    },

  };

})();

