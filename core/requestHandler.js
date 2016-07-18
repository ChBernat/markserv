(function () {

  'use strict';


  var fs = require('fs');
  var path = require('path');
  var minimatch = require('minimatch');
  var logger = require('./logger.js');


  // Markdown Extension Types

  var markdownExtensions = require('./file-types.core.json').markdown;
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

    var dir = global.settingsPath + req.originalUrl;

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
      logger.error(error);
      logger.error(stat);
      return moduleMapper.http404.apply(context, arguments);
    }


    // First lets check if we have a custom module loaded for this kind of file/path
    // Eg: "*.css", or "posts/"
    for (var module in moduleMapper) {

      // Where "module" is a file-type, or path
      // Slice because we remove the "./" we added to the path to make sure the minimatch processes
      // the comparison relatively. Ok bad english. Sorry.
      var matchingModuleLoaded = minimatch(req.originalUrl, module, { matchBase: true });
      logger.log(req.originalUrl, module, matchingModuleLoaded);

      if (matchingModuleLoaded) {
        return moduleMapper[module].apply(context, arguments);
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


  // function http_request_handler (req, res, next) {
  //   // if (flags.verbose){
  //   //   msg('request')
  //   //    .write(unescape(dir)+unescape(req.originalUrl))
  //   //    .reset().write('\n');
  //   // }
  //   //
  //   // console.log(req);


  //   // Better to do with path.resolve?
  //   var dir = global.flags.dir + unescape(req.originalUrl);

  //   // console.log(dir);

  //   // var path = unescape(dir)+unescape(req.originalUrl);
  //   var path = unescape(req.originalUrl);
  //   console.log(path);

  //   var stat;
  //   var isDir;
  //   var isMarkdown;

  //   try {

  //     stat = fs.statSync(path);
  //     isDir = stat.isDirectory();
  //     isMarkdown = false;

  //     if (!isDir) {
  //       isMarkdown = hasMarkdownExtension(path);
  //     }
  //   }
  //   catch (e) {
  //     res.writeHead(200, {'Content-Type': 'text/html'});
  //     // boohoo('404').write(path.slice(2)).reset().write('\n');
  //     res.write("404 :'(");
  //     res.end();
  //     return;
  //   }

  //   // Markdown: Browser is requesting a Markdown file
  //   if (isMarkdown) {
  //     // msg('markdown').write(path.slice(2)).reset().write('\n');
  //     // compileAndSendMarkdown(path, res);
  //     console.log('isMarkdown');
  //   }

  //   // Index: Browser is requesting a Directory Index
  //   else if (isDir) {
  //     // msg('dir').write(path.slice(2)).reset().write('\n');
  //     // compileAndSendDirectoryListing(path, res);
  //     //
  //     console.log( markserv.plugins.dir.template);

  //     markserv.plugins.dir.func({
  //       dirname: dir,
  //       template: markserv.plugins.dir.template,
  //       http: {
  //         req: req,
  //         res: res,
  //         next: next,
  //       }
  //     });
  //   }

  //   // Other: Browser requests other MIME typed file (handled by 'send')
  //   else {
  //     // msg('file').write(path.slice(2)).reset().write('\n');
  //     send(req, path, { root: dir }).pipe(res);
  //   }
  // }


  function mapModules (moduleMap) {
    for (var moduleName in moduleMap) {
      moduleMapper[moduleName] = moduleMap[moduleName];
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
