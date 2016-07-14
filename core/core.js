(function () {

  'use strict';

  module.exports = function core (fs, path, server, readutf8) {

    return {
    };

  };



  // var fs = require('fs');
  // var path = require('path');
  // var root = path.resolve('.');

  // var httpServer = require('./http-server.core.js');
  // // var readUTF8 = require('./read-utf8.core.js');


  // function readfile (filename) {
  //   return fs.readFileSync(filename, 'utf8').toString();
  // }

  // function loadtemplate (filename) {
  //   return readfile(filename);
  // }


  // var plugins = {};

  // function loadplugin (pluginAry) {
  //   pluginAry.forEach(function (pluginfile) {

  //     // console.log(path.resolve(pluginfile));
  //     var plugin = require(path.resolve(pluginfile));
  //     var templateHTML = loadtemplate(path.resolve('./plugins/'+plugin.template));


  //     global.markserv.plugins[plugin.name] = {
  //       func: plugin.func,
  //       template: templateHTML,
  //     };

  //   });
  // }


  // module.exports = {
  //   readfile: readfile,
  //   loadtemplate: loadtemplate,
  //   loadplugin: loadplugin,
  // };

})();

