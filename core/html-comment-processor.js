(function () {

  'use strict';

  var path = require('path');
  var Promise = require('bluebird');

  var incprocdir = path.dirname(__filename) + '/incproc/';

  var processors = {
    'include': require(incprocdir + 'html.inc.js'),
    'less': require(incprocdir + 'less.inc.js'),
  };

  function commentProcessor (type, node, dir, $, processor, filterHtml) {
    if (processors.hasOwnProperty(type)) {
      return processors[type](node, dir, $, processor, filterHtml);
    }
    else {
      return dummyPromise();
    }
  }

  function dummyPromise () {
    return new Promise(function (resolve, reject) {
      console.log('..dummy');
      resolve();
    });
  }

  module.exports = commentProcessor;

})();

