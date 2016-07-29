// Loads a stack of html comment node processors that specify how a
// particular include type will work, then it will fire back with a result
// that the htmlParser will insert into the place where the comment node
// used to exist.
(function () {

  'use strict';

  var log = require('../log.js');


  module.exports = function includeProcessors (settings, path) {

    var loadedProcessors = {};

    var processors = settings.processors;

    for (var name in processors) {
      if (processors.hasOwnProperty(name)) {
        var processorFile = path + '/' + processors[name];
        var processorModule = require(processorFile);
        loadedProcessors[processorModule.type] = processorModule.func;
        log.info('loaded processor ' + ('"'+name+'"').white + ' from ' + ('"'+processorFile+'"').white);
      }
    }

    return loadedProcessors;
  };

})();


