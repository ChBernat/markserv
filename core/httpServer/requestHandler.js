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


  function processRequest (req, res, next) {

    var dir = context.path.root + req.originalUrl;

    // console.log(dir);

    var stat;
    var isDir;
    var isMarkdown;
    var payload;

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
      var payload = moduleMapper.http404.apply(context, arguments);
      return httpRespond.apply(payload, arguments);
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
          payload = moduleMapper[module].apply(context, arguments);
          return httpRespond.apply(payload, arguments);
        } else {
          log.warn(module + ' module not in map or ' + module + 'module error');
        }
      }
    }

    // If we don't have an explicit custom match, continue the core mod handlers
    if (isMarkdown) {
      if (moduleMapper.hasOwnProperty('markdown')) {
        moduleMapper.markdown.apply(context, arguments)
          .then(function (payload) {
            return httpRespond.apply(payload, [req, res, next]);
          });
      } else {
        log.warn('Markdown module not in map or Markdown module error');
      }
    }

    else if (isDir) {
      // Log DIR request
      if (moduleMapper.hasOwnProperty('directory')) {
        payload = moduleMapper.directory.apply(context, arguments);
        return httpRespond.apply(payload, arguments);
      } else {
        log.warn('Directory module not in map or Directory module error');
      }
    }

    else {
      // Fall back to file
      if (moduleMapper.hasOwnProperty('file')) {
        moduleMapper.file.apply(context, arguments);
        // Skip over http response as the Send happens
        // in the module itself
        return null;
      } else {
        log.warn('File module not in map or File module error');
      }
    }
  }


  function httpRespond (req, res) {

    res.writeHead(this.statusCode, {
      'Content-Type': this.contentType,
    });

    res.write(this.data);
    res.end();

    return payload;
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
