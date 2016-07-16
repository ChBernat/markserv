(function () {

  'use strict';

  var Promise = require('bluebird');
  var fs = require('fs');
  var cheerio = require('cheerio');
  var path = require('path');


  // getFile: reads utf8 content from a file
  function getFile(path){
    return new Promise(function (resolve, reject) {
      fs.readFile(path, 'utf8', function(err, data){
        if (err) return reject(err);
        resolve(data);
      });
    });
  }




  function processTemplate () {

    return function (filepath, settingsPath) {
      return new Promise(function (resolve, reject) {

        getFile(filepath).then(function (html) {

          // Load the HTML file into Cheerio DOM parser
          var $ = cheerio.load(html);

          // Directory relative to the file
          var filedir = settingsPath;
          // console.log(filedir);

          // Scan an HTML file for comment nodes that contain "include" Eg: <!--include|page.html-->
          var nodeCount = 0;
          var includeCount = 0;
          var includeSuccessCount = 0;

          function filterHtml (elem, dir) {
            nodeCount += 1;
            // console.log(dir);

            if (elem.hasOwnProperty('children')) {
              var length = elem.children.length;
              var i = 0;

              for(; i< length; i +=1) {
                var childNode = elem.childNodes[i];
                filterHtml(childNode, dir);

                // File include comment
                if (isIncludeComment(childNode)) {
                  includeCount += 1;
                  var include = parseInclude(childNode, dir);

                 // if no error reading file
                  if (include.contents) {
                    var rootNode = cheerio.load(include.contents)._root.children[0];
                    $(childNode).replaceWith(rootNode);
                    filterHtml(rootNode, include.dir);
                    includeSuccessCount += 1;
                  }
                }
              }
            }

            return elem;
          }


          // Begin searching for comments
          filterHtml($._root, filedir);

          // console.log('Processed ' + nodeCount + ' DOM nodes in: ' + filepath);
          // console.log('Found ' + includeCount + ' include comments in: ' + filepath);
          // console.log('Include errors: ' + (includeCount - includeSuccessCount) + ' in: ' + filepath);

          // // Write out the resulting HTML
          var htmlOutput = $.html();
          // console.log(htmlOutput);
          resolve(htmlOutput);
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



  function parseInclude (childNode, dir) {
    var incFileName = relativeFilename(childNode);
    var incFilePath = dir + '/' + incFileName;
    var incFileContents = readContents(incFilePath);

    // The new include may change the relative path of it's child nodes
    var incFileDir = path.dirname(incFilePath);

    return {
      filename: incFileName,
      contents: incFileContents,
      dir: incFileDir,
    };
  }



  function readContents (fpath) {
    return fs.readFileSync(fpath).toString();
    // if (!grunt.file.exists(fpath)) {
    //   grunt.log.warn('Source file "' + fpath + '" not found.');
    //   return false;
    // } else {
    //   return grunt.file.read(fpath);
    // }
  }


  function isIncludeComment (node) {
    if (node.type !== 'comment') {
      return false;
    }

    // Look for "include" between "<!--" and the ":" colon
    var tagRef = node.data
      .slice(0, node.data.indexOf(':'))
      .replace(/\s+/g, '')
      .toLowerCase();

    if (tagRef !== 'include') {
      return false;
    } else {
      return true;
    }
  }


  function isDataComment (node) {
    if (node.type !== 'comment') {
      return false;
    }

    // Look for "data" between "<!--" and the ":" colon
    var tagRef = node.data
      .slice(0, node.data.indexOf(':'))
      .replace(/\s+/g, '')
      .toLowerCase();

    if (tagRef !== 'data') {
      return false;
    } else {
      return true;
    }
  }


  function relativeFilename (elem) {
    // Get everything before the colon, remove the whitespace
    var filename = elem.data
      .slice(elem.data.lastIndexOf(':')+1)
      .replace(/\s+/g, '');

    // console.log('Found include tag: ' + filename);

    return filename;
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
