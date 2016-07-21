(function () {

  'use strict';

  var fs = require('fs');
  var Promise = require('bluebird');
  var log = require('./logger.js');

  module.exports = function (filepath) {

    return new Promise(function (resolve, reject) {
      fs.readFile(filepath, 'utf8', function (err, data) {
        if (err) {
          log.error(err);
          return reject (err);
        }

        resolve(data);
      });
    });
  };

})();
