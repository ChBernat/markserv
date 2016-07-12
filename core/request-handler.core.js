(function () {

  'use strict';


  // Markdown Extension Types

  var markdownExtensions = require('./file-types.core.json').markdown;

  var watchExtensions = markdownExtensions.concat(global.settings.watch);


  var fs = require('fs');
  var send = require('send');


  // http_request_handler: handles all the browser requests

  function http_request_handler (req, res, next) {
    // if (flags.verbose){
    //   msg('request')
    //    .write(unescape(dir)+unescape(req.originalUrl))
    //    .reset().write('\n');
    // }
    //
    // console.log(req);
    var dir = req.path;

    // var path = unescape(dir)+unescape(req.originalUrl);
    var path = unescape(req.originalUrl);
    console.log(path);

    var stat;
    var isDir;
    var isMarkdown;

    try {
      stat = fs.statSync(path);
      isDir = stat.isDirectory();
      isMarkdown = false;

      if (!isDir) {
        isMarkdown = hasMarkdownExtension(path);
      }
    }
    catch (e) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      // boohoo('404').write(path.slice(2)).reset().write('\n');
      res.write("404 :'(");
      res.end();
      return;
    }

    // Markdown: Browser is requesting a Markdown file
    if (isMarkdown) {
      // msg('markdown').write(path.slice(2)).reset().write('\n');
      // compileAndSendMarkdown(path, res);
      console.log('isMarkdown');
    }

    // Index: Browser is requesting a Directory Index
    else if (isDir) {
      // msg('dir').write(path.slice(2)).reset().write('\n');
      // compileAndSendDirectoryListing(path, res);
      console.log('compileAndSendDirectoryListing');
      console.log(markserv.plugins.dir(path));
    }

    // Other: Browser requests other MIME typed file (handled by 'send')
    else {
      // msg('file').write(path.slice(2)).reset().write('\n');
      send(req, path, {root:dir}).pipe(res);
    }
  }



  module.exports = {
    handle: function (req, res, next) {
      return http_request_handler(req, res, next);
    },
  };

})();

