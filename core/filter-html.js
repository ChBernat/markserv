(function () {

  'use strict';

  var Promise = require('bluebird');

  function getCommentType (node) {
    return node.data
      .slice(0, node.data.indexOf(':'))
      .replace(/\s+/g, '')
      .toLowerCase();
  }


  function hasChildren(elem) {
    return elem.hasOwnProperty('children');
  }


  function getRelativeFilename (elem) {
    // Get everything before the colon, remove the whitespace
    var filename = elem.data
      .slice(elem.data.lastIndexOf(':')+1)
      .replace(/\s+/g, '');

    // console.log('Found include tag: ' + filename);

    return filename;
  }


  function isComment(node) {
    if (!node.hasOwnProperty('type')) {
      return false;
    }

    return node.type === 'comment';
  }

  // var commentProcessor = require('./html-comment-processor.js');

  var filterHtml = function filterHtml (elem, dir, $, processor, filterHtml) {
    return new Promise(function (resolve, reject) {

      if (!hasChildren(elem)) {
        return resolve();
      }

      var promiseStack = [];

      elem.childNodes.forEach(function (childNode) {
        // console.log(getCommentType(childNode));

        var type = isComment(childNode) && getCommentType(childNode);

        if (type) {
          // console.log(type);
          var filename = getRelativeFilename(childNode);

          promiseStack.push(processor(type, childNode, dir, $, processor, filterHtml));
        }
        else {
          promiseStack.push(filterHtml(childNode, dir, $, processor, filterHtml));
        }

      });

      if (!promiseStack.length) {
        console.log('NO PROMISES HERE!!!');
        return resolve();
      }

      Promise.all(promiseStack).then(function (data) {
        return resolve();
      });

    });
  };


  module.exports = filterHtml;

})();
