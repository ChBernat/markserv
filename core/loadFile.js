// All file loading in the app should happen through this module
(function () {

  'use strict';

  var fs = require('fs');
  var Promise = require('bluebird');
  var log = require('./log.js');

  module.exports = function (filepath) {

    return new Promise(function (resolve, reject) {
      fs.readFile(filepath, {encoding: 'utf-8'}, function (err, data) {
        if (err) {
          log.error(err);
          return reject (err);
        }

        resolve(data);
      });
    });
  };

})();
