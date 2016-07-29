(function () {

  'use strict';


  var fs = require('fs');
  var minimatch = require('minimatch');
  var log = require('../log.js');


  // Markdown Extension Types

  var markdownExtensions = require('../fileTypes.json').markdown;
  // var watchExtensions = markdownExtensions.concat(global.settings.watch);


  // The context (Markserv instance object) passed down through request handlers to modules
  var context = this;

  // var send = require('send');

  // hasMarkdownExtension: check whether a file is Markdown type
  function hasMarkdownExtension (path) {
    var fileExtension = path.substr(path.length-3).toLowerCase();
    var extensionMatch = false;

    markdownExtensions.forEach(function(extension){
      if (extension === fileExtension){
        extensionMatch = true;
      }
    });

    return extensionMatch;
  }


  // Modules are loaded here
  // Traffic is directed to module
  var moduleMapper = {

    // markdown: function markdown () {
    // },

    // directory: function directory () {
    // },

    // http404: function http404 () {
    // },

    // file: function file () {
    // },

    // etc...
    //
  };


  function processRequest (req) { // (req, res, next)

    var dir = context.path.root + req.originalUrl;

    // console.log(dir);

    var stat;
    var isDir;
    var isMarkdown;

    try {

      stat = fs.statSync(dir);
      isDir = stat.isDirectory();
      isMarkdown = false;

      if (!isDir) {
        isMarkdown = hasMarkdownExtension(dir);
      }
    }
    catch (error) {
      log.error(error);
      log.error(stat);
      return moduleMapper.http404.apply(context, arguments);
    }


    // First lets check if we have a custom module loaded for this kind of file/path
    // Eg: "*.css", or "posts/"
    for (var module in moduleMapper) {
      if (moduleMapper.hasOwnProperty(module)) {

        // Where "module" is a file-type, or path
        // Slice because we remove the "./" we added to the path to make sure the minimatch processes
        // the comparison relatively. Ok bad english. Sorry.
        var matchingModuleLoaded = minimatch(req.originalUrl, module, { matchBase: true });
        log.trace(req.originalUrl, module, matchingModuleLoaded);

        if (matchingModuleLoaded) {
          return moduleMapper[module].apply(context, arguments);
        }
      }
    }

    // If we don't have an explicit custom match, continue the core mod handlers
    if (isMarkdown) {
      return moduleMapper.markdown.apply(context, arguments);
    }

    else if (isDir) {
      // Log DIR request
      return moduleMapper.directory.apply(context, arguments);
    }

    else {
      // Fall back to file
      return moduleMapper.file.apply(context, arguments);
    }
  }


  function mapModules (moduleMap) {
    for (var moduleName in moduleMap) {
      if (moduleMap.hasOwnProperty(moduleName)) {

        moduleMapper[moduleName] = moduleMap[moduleName];
      }
    }
  }

  function setContext (scope) {
    context = scope;
  }

  module.exports = {
    processRequest: processRequest,
    mapModules: mapModules,
    setContext: setContext,
  };

})();
