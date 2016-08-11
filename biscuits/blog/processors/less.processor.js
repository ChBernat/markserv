(function () {

  'use strict';

  var cheerio = require('cheerio');
  var Promise = require('bluebird');
  var lessc = require('less');
  var path = require('path');


  // With the HTML type, we simply get the new HTML content
  // and pass it back as a live cheerio DOM node to be instered
  // into the HTML DOM
  function processLessInclude (includeFilePath, loadFile) {
    return new Promise(function (resolve, reject) {

      loadFile(includeFilePath).then(function (lessFileContents) {
        lessc.render(lessFileContents, {

          // Make sure includes happen relative to the current file
          filename: path.resolve(includeFilePath),
        }).then(function (lessData) {

          var styleTag = '<style>' + lessData.css + '</style>';
          var $styleTagAsHtmlDOM = cheerio.load(styleTag)._root;

          resolve($styleTagAsHtmlDOM);
        }).catch(function (reason) {
          reject(reason);
        });
      });

    });
  }

  module.exports = {
   // <!--less:filename.less-->
    type: 'less',
    func: processLessInclude,
  };

})();
