// Takes plaintext html, steps through the nodes looking for comment nodes
// that specificy includes that need processing, then calls the processor
// for that node, and inserts the new HTML/text where the comment node used
// to be.
(function () {

  'use strict';

  var fs = require('fs');
  var Promise = require('bluebird');
  var cheerio = require('cheerio');
  var log = require('../logger.js');
  var path = require('path');
  var loadFile = require('../loadFile.js');

  // The root dom element into which everyting else is compiled
  // then returned to the markserv mapper to be rendered though
  // the Handlerbars template via the http server.
  var $DOM;

  // Load HTML Include Processors
  // (Used to create HTML templates for the HTTP Request Handler)
  var processorLoader = require('./includeProcessor.js');
  var processors = processorLoader(global.settings, global.settingsPath);


  function begin (html, dir, loadedHtmlIncludeProcessors) {
    return new Promise(function (resolve, reject) {

      // Intentional side effect. We want the Cheerio root DOM to
      // exist outside of the filter because we need to replace
      // nodes via the root in order for the $DOM.html() rendering
      // to work after the HTML has been parsed.
      $DOM = loadDom(html);

      var $rootElem = $DOM._root;

      filter($rootElem, dir).then(function () {
        var htmlTemplateOutput = $DOM.html();
        resolve(htmlTemplateOutput);
      }).catch(function (reason) {
        console.log('#FAIL: filterHtml.filter()');
        console.error(reason);
      });

    });
  }

  function processNode (node, type, includeFilePath) {
    return new Promise(function (resolve, reject) {

      processors[type](includeFilePath, loadFile).then(function (content) {
        $DOM(node).replaceWith(content);

        // The include may have updated the relative path
        var includeDir = path.dirname(includeFilePath);

        filter(content, includeDir).then(function () {
          resolve();
        });
      });

    });
  }

  function filter (node, dir) {
    return new Promise(function (resolve, reject) {

      if (!hasChildren(node)) {
        return resolve();
      }

      var promiseStack = [];

      node.childNodes.forEach(function (childNode) {

        var type = isComment(childNode) && getCommentType(childNode);

        if (type) {
          var includeFilename = getRelativeFilename(childNode);
          var includeFilePath = dir + '/' + includeFilename;
          promiseStack.push(processNode(childNode, type, includeFilePath));
        }
        else {
          promiseStack.push(filter(childNode, dir));
        }

      });

      if (!promiseStack.length) {
        console.log('0 promises created in this html section');
        return resolve();
      }

      Promise.all(promiseStack).then(function (data) {
        return resolve();
      });

    });
  }

  function getCommentType (node) {
    return node.data
      .slice(0, node.data.indexOf(':'))
      .replace(/\s+/g, '')
      .toLowerCase();
  }

  function hasChildren(elem) {
    return elem.hasOwnProperty('children');
  }

  // Splits the text content of the comment node and returns everything
  // before the colon, (removes whitespace), and then returns the result
  // which is the type of processor which is being called in the include
  // template.
  function getRelativeFilename (elem) {
    var filename = elem.data
      .slice(elem.data.lastIndexOf(':')+1)
      .replace(/\s+/g, '');

    return filename;
  }

  function isComment(node) {
    if (!node.hasOwnProperty('type')) {
      return false;
    }

    return node.type === 'comment';
  }

  function loadDom (html) {
    return cheerio.load(html);
  }

  module.exports = begin;

})();

