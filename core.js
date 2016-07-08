(function () {

  'use strict';

  var fs = require('fs');

  function readfile (filename) {
    return fs.readFileSync(filename, 'utf8').toString();
  }

  function loadtemplate (filename) {
    return readfile(filename);
  }


  var plugins = {};

  function loadplugin (pluginAry) {
    pluginAry.forEach(function (pluginfile) {

      var plugin = require(pluginfile);
      var template = loadtemplate('./plugins/'+plugin.template);

      console.log(plugin);
      console.log(template);

      // plugins[''];
      // pluginfile.
      // pluginAry
    });
  }


  module.exports = {
    readfile: readfile,
    loadtemplate: loadtemplate,
    loadplugin: loadplugin,
  };

})();

