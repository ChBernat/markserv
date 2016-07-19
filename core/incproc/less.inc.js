(function () {

  'use strict';

  var cheerio = require('cheerio');
  var Promise = require('bluebird');
  var path = require('path');
  var lessc = require('less');


  var fs = require('fs');

  function getRelativeFilename (elem) {
    // Get everything before the colon, remove the whitespace
    var filename = elem.data
      .slice(elem.data.lastIndexOf(':')+1)
      .replace(/\s+/g, '');

    // console.log('Found include tag: ' + filename);

    return filename;
  }


  // getFile: reads utf8 content from a file
  function getFile (path) {
    console.log(path);
    return new Promise(function (resolve, reject) {
      fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
          return reject(err);
        }

        resolve(data);
      });
    });
  }


  module.exports = function processInclude (childNode, dir, $, processor, filterHtml) {

    return new Promise(function (resolve, reject) {

      var filename = getRelativeFilename(childNode);
      var filepath = dir + '/' + filename;

      getFile(filepath).then(function (contents) {

        lessc.render(contents).then(function (data) {

          var style = '<style>' + data.css + '</style>';

          var rootNode = cheerio.load(style)._root.children[0];
          $(childNode).replaceWith(rootNode);

          // The new include may change the relative path of it's child nodes
          var incDir = path.dirname(filepath);

          // Start a new filter incase we have nested includes
          filterHtml(rootNode, incDir, $, processor, filterHtml).then(function () {
            resolve();
          });
        });

      });

    });

  };

})();
