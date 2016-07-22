(function () {

  'use strict';

  var loadFile = require('../../loadFile.js');
  var cheerio = require('cheerio');
  var Promise = require('bluebird');


  function processSvgInclude (includeFilePath) {
    return new Promise(function (resolve, reject) {

      loadFile(includeFilePath).then(function (svgFileContents) {

        // IE9 Friendly SVGs
        var dataType = 'data:image/svg+xml,';

        var svgData = encodeURIComponent(svgFileContents)
          .replace(/'/g,"%27")
          .replace(/"/g,"%22");

//        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=
        // var imgTag = '<img class="markserv-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=" style="background-image:url(\'' + dataType + svgData + '\');background-size:100% 100%;" />';
        var imgTag = '<img class="markserv-img" src="' + dataType + svgData + '" />';

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
