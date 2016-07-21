(function () {

  'use strict';

  var loadFile = require('../../loadFile.js');
  var cheerio = require('cheerio');
  var Promise = require('bluebird');
  var lessc = require('less');


  // With the HTML type, we simply get the new HTML content
  // and pass it back as a live cheerio DOM node to be instered
  // into the HTML DOM
  function processLessInclude (includeFilePath) {
    return new Promise(function (resolve, reject) {

      loadFile(includeFilePath).then(function (lessFileContents) {
        lessc.render(lessFileContents).then(function (lessData) {

          var styleTag = '<style>' + lessData.css + '</style>';
          var $styleTagAsHtmlDOM = cheerio.load(styleTag)._root;

          resolve($styleTagAsHtmlDOM);
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
