// Takes plaintext html, steps through the nodes looking for comment nodes
// that specificy includes that need processing, then calls the processor
// for that node, and inserts the new HTML/text where the comment node used
// to be.
(function () {

  'use strict';

  var Promise = require('bluebird');
  var cheerio = require('cheerio');
  var log = require('../log.js');
  var path = require('path');
  var loadFile = require('../loadFile.js');

  // The root dom element into which everyting else is compiled
  // then returned to the markserv mapper to be rendered though
  // the Handlerbars template via the http server.
  var $DOM;

  // Load HTML Include Processors
  // (Used to create HTML templates for the HTTP Request Handler)
  var processorLoader = require('./loadProcessors.js');
  var processors = processorLoader(global.markserv.settings,
                                   global.markserv.settingsPath);


  function begin (html, dir) {
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
        log.error('failed to filter html');
        log.error(reason);
        reject(reason);
      });

    });
  }

  function processNode (node, type, includeFilePath) {
    return new Promise(function (resolve, reject) {

      // console.log(type, includeFilePath);
      if (!processors.hasOwnProperty(type)) {
        // return reject('No processor type: ' + type);
        resolve();
      }
      // console.log(type);


      processors[type](includeFilePath, loadFile).then(function (content) {
        $DOM(node).replaceWith(content);

        // The include may have updated the relative path
        var includeDir = path.dirname(includeFilePath);

        filter(content, includeDir).then(function () {
          resolve();
        });
      }).catch(function (reason) {
        return reject(reason);
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
        log.debug('No promises created for this html.');
        return resolve();
      }

      Promise.all(promiseStack).then(function (data) {
        return resolve(data);
      }).catch(function (reason) {
        reject(reason);
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

