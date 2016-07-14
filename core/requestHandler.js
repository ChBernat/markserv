(function () {

  'use strict';


  var fs = require('fs');

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


  var handle = {

    http404: function http404 () {
      console.log('404');
    },

    markdown: function markdown () {
      console.log('markdown');
      // msg('markdown').write(path.slice(2)).reset().write('\n');
      // compileAndSendMarkdown(path, res);
      // console.log('isMarkdown');
    },

    directory: function directory () {
      console.log('directory');
      // msg('dir').write(path.slice(2)).reset().write('\n');
      // markserv.plugins.dir.func({
      //   dirname: dir,
      //   template: markserv.plugins.dir.template,
      //   http: {
      //     req: req,
      //     res: res,
      //     next: next,
      //   }
      // });
    },

    // directory: require(markserv.settings);

    other: function other () {
      console.log('other');
      // send(req, path, { root: dir }).pipe(res);
      // msg('file').write(path.slice(2)).reset().write('\n');
    },

  };

  function processRequest (req, res, next) {
    // Better to do with path.resolve?
    var dir = global.flags.dir + unescape(req.originalUrl);
    var path = unescape(req.originalUrl);
    console.log(path);

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
      console.log(error);
      console.log(stat);
      return handle.http404(error);
    }

    if (isMarkdown) {
      return handle.markdown();
    }

    else if (isDir) {
      return handle.directory();
    }

    else {
      return handle.other();
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


  module.exports = processRequest;

})();
