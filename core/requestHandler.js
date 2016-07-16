(function () {

  'use strict';


  var fs = require('fs');
  var path = require('path');

  // Markdown Extension Types

  var markdownExtensions = require('./file-types.core.json').markdown;
  // var watchExtensions = markdownExtensions.concat(global.settings.watch);

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


  // Modules are loaded into these stubs
  var moduleMapper = {

    markdown: function markdown () {
    },

    directory: function directory () {
    },

    file: function file () {
    },

    http404: function http404 () {
    },

  };


  // Wrapping the stubs in handler funcs to cleanly monitor events
  var handle = {

    http404: function http404 () {
      moduleMapper.http404.apply(this, arguments);
    },

    markdown: function markdown () {
      // log is markdown
      moduleMapper.markdown.apply(this, arguments);
      // msg('markdown').write(path.slice(2)).reset().write('\n');
      // compileAndSendMarkdown(path, res);
      // console.log('isMarkdown');

    },

    directory: function directory () {
      // log is dir
      moduleMapper.directory.apply(this, arguments);
    },

    file: function other () {
      // log is file
      moduleMapper.file.apply(this, arguments);
      // msg('file').write(path.slice(2)).reset().write('\n');

    },

  };

  function processRequest (req, res, next) {

    var dir = '.' + req.originalUrl;

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
      console.error(error);
      console.error(stat);
      return handle.http404.apply(this, arguments);
    }

    if (isMarkdown) {
      return handle.markdown.apply(this, arguments);
    }

    else if (isDir) {
      // Log DIR request
      return handle.directory.apply(this, arguments);
    }

    else {
      return handle.file.apply(this, arguments);
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


  module.exports = {
    processRequest: processRequest,
    mapModules: mapModules,
  };

})();
