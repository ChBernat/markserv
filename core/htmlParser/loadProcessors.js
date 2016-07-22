// Loads a stack of html comment node processors that specify how a
// particular include type will work, then it will fire back with a result
// that the htmlParser will insert into the place where the comment node
// used to exist.
(function () {

  'use strict';

  var path = require('path');
  var Promise = require('bluebird');
  var fs = require('fs');

  function isFileType (filename, type) {
    var lastIndexOfType = filename.lastIndexOf(type);
    return filename.length-type.length === lastIndexOfType;
  }

  module.exports = function includeProcessors (settings, path) {
    var loadedProcessors = {};

    var processors = settings.processors;

    for (var name in processors) {
      var processorModule = require(path + '/' + processors[name]);
      loadedProcessors[processorModule.type] = processorModule.func;
    }

    console.log(loadedProcessors);

    return loadedProcessors;
  };

})();


