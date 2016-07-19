(function () {

  'use strict';

  var Promise = require('bluebird');
  var fs = require('fs');
  var cheerio = require('cheerio');

  var processor = require('./html-comment-processor.js');
  var filterHtml = require('./filter-html.js');


  function processTemplate () {

    return function (filepath, settingsPath) {
      return new Promise(function (resolve, reject) {

        getFile(filepath).then(function (html) {

          // Load the HTML file into Cheerio DOM parser
          var $ = cheerio.load(html);

          // Directory relative to the file
          var filedir = settingsPath;

          // Begin searching for comments
          filterHtml($._root, filedir, $, processor, filterHtml).then(function (data) {

            console.log('ALL DONE!');

            // Write out the resulting HTML
            var htmlOutput = $.html();
            // console.log(htmlOutput);
            resolve(htmlOutput);

          }).catch(function (reason) {
            console.log('#fail');
            console.error(reason);
          });

        });
      });
    };
  }






  function getDataType (childNode) {
    var dataType = childNode.data
      .slice(childNode.data.lastIndexOf(':')+1)
      .replace(/\s+/g, '');

    return dataType;
  }





  function readContents (fpath) {
    return new Promise(function (resolve, reject) {

      fs.readFile(fpath, 'utf8', function (err, data) {
        if (err) {
          return reject(err);
        }

        resolve(data);
      });

    });
  }


  // getFile: reads utf8 content from a file
  function getFile(path){
    return new Promise(function (resolve, reject) {
      fs.readFile(path, 'utf8', function(err, data){
        if (err) return reject(err);
        resolve(data);
      });
    });
  }



  function isType (type, node) {
    if (node.type !== 'comment') {
      return false;
    }

    // Look for "include" between "<!--" and the ":" colon
    var tagRef = node.data
      .slice(0, node.data.indexOf(':'))
      .replace(/\s+/g, '')
      .toLowerCase();

    if (tagRef !== type) {
      return false;
    } else {
      return true;
    }
  }



  // Returns string 'file' or 'dir' (based on lstat)
  function isFileOrDir (pathAndFile) {
    var stats = fs.lstatSync(pathAndFile);

    if (stats.isFile()) {
      return 'file';
    } else if (stats.isDirectory()) {
      return 'dir';
    }
  }



  module.exports = processTemplate();

})();
