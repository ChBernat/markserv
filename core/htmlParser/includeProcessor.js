// Loads a stack of html comment node processors that specify how a
// particular include type will work, then it will fire back with a result
// that the htmlParser will insert into the place where the comment node
// used to exist.
(function () {

  'use strict';

  var path = require('path');
  var Promise = require('bluebird');
  var fs = require('fs');

  var loadedProcessors = {};

  var files = fs.readdirSync(__dirname+'/includeProcessors/');

  files.map(function (filename) {
    if (isFileType(filename, '.js')){
      var processorModule = require('./includeProcessors/' + filename);
      loadedProcessors[processorModule.type] = processorModule.func;
    }
  });


  function isFileType (filename, type) {
    var lastIndexOfType = filename.lastIndexOf(type);
    return filename.length-type.length === lastIndexOfType;
  }


  module.exports = loadedProcessors;

})();


