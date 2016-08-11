(function () {

  'use strict';

  var cheerio = require('cheerio');
  var Promise = require('bluebird');


  // With the HTML type, we simply get the new HTML content
  // and pass it back as a live cheerio DOM node to be instered
  // into the HTML DOM.
  function processHtmlInclude (includeFilePath, loadFile) {
    return new Promise(function (resolve, reject) {

      loadFile(includeFilePath).then(function (htmlFileContents) {

        var $contentAsHtmlDOM = cheerio.load(htmlFileContents)._root;
        resolve($contentAsHtmlDOM);

      }).catch(function (reason) {
        reject(reason);
      });

    });
  }

  module.exports = {
   // <!--html:filename.html-->
    type: 'html',
    func: processHtmlInclude,
  };

})();
