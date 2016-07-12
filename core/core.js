(function () {

  'use strict';

  var fs = require('fs');

  var httpServer = require('./http-server.core.js');
  // var readUTF8 = require('./read-utf8.core.js');


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
      var template = loadtemplate('/plugins/'+plugin.template);

      global.markserv.plugins[plugin.name] = {
        func: plugin.func,
        template: plugin.template,
      };

    });
  }


  module.exports = {
    readfile: readfile,
    loadtemplate: loadtemplate,
    loadplugin: loadplugin,
  };

})();

