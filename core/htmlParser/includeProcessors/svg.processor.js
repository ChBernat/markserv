(function () {

  'use strict';

  var loadFile = require('../../loadFile.js');
  var cheerio = require('cheerio');
  var Promise = require('bluebird');


  function processSvgInclude (includeFilePath) {
    return new Promise(function (resolve, reject) {

      loadFile(includeFilePath).then(function (svgFileContents) {

        // IE9 Friendly SVGs
        var dataType = 'data:image/svg+xml;undefined,';

        var svgData = encodeURIComponent(svgFileContents)
          .replace(/'/g,"%27")
          .replace(/"/g,"%22");

        var imgTag = '<img src="' + dataType + svgData + '">';
        var $contentAsHtmlDOM = cheerio.load(imgTag)._root;

        resolve($contentAsHtmlDOM);
      });

    });
  }

  module.exports = {
   // <!--svg:filename.svg-->
    type: 'svg',
    func: processSvgInclude,
  };

})();
