(function () {

  'use strict';

  require('./colors.js');

  var levels = {
    'trace': 0,
    'debug': 1,
    'info': 2,
    'log': 3,
    'warn': 4,
    'error': 5,
    'fatal': 6,
  };

  var levels_enum = {
    0: 'trace',
    1: 'debug',
    2: 'info',
    3: 'log',
    4: 'warn',
    5: 'error',
    6: 'fatal',
  };

  // var codes = {
  //   0: 'Unknown',
  // };

  var activeLogLevel = 3;

  var MarkservTitle = ''.reset + 'MS↓'.bgGreen.white.bold + ' '.reset + (levels_enum[activeLogLevel]+':').white + ' ';


  function cap (word) {
    return word.charAt(0).toUpperCase() + word.slice(1) + ': ';
  }

  function handleMessage (detail, data, code) {

    if (activeLogLevel > levels[this]) {
      return;
    }

    switch (this) {
      case 'trace':
        // console.log(cap(this), detail, data);
        console.log(MarkservTitle + detail);
        break;
      case 'debug':
        // console.log(this, detail, data);
        console.log(MarkservTitle + detail);
        break;
      case 'info':
        console.log(MarkservTitle + detail);
        // console.log(this, detail, data);
        break;
      case 'log':
        console.log(MarkservTitle + detail);
        // console.log(MarkservTitle + module(detail));
        // console.log(this, detail, data);
        break;
      case 'warn':
        // console.warn(this, detail, data);
        console.warn(MarkservTitle + detail);
        break;
      case 'error':
        console.log(MarkservTitle + detail);
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

    setLevel: function (level) {
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
      handleMessage.apply('info', arguments);
    },
    log: function () {
      handleMessage.apply('log', arguments);
    },
    warn: function () {
      handleMessage.apply('warn', arguments);
    },
    error: function () {
      handleMessage.apply('error', arguments);
    },
    fatal: function () {
      handleMessage.apply('fatal', arguments);
    },

  };

})();

