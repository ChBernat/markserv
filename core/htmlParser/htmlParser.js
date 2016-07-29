(function () {

  'use strict';

  var Promise = require('bluebird');
  var loadFile = require('../loadFile.js');
  var path = require('path');
  var filterHtml = require('./filterHtml.js');

  function parseHtml (templateFile) {
    return new Promise(function (resolve, reject) {
      var templatePath = path.dirname(templateFile);

      loadFile(templateFile).then(function (html) {

        filterHtml(html, templatePath).then(function (html) {
          resolve(html);
        }).catch(function (reason) {
          reject(reason);
        });

      });

    });
  }

  module.exports = {
    parse: parseHtml,
  };

})();
