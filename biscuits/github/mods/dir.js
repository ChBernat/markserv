(function () {

  'use strict';

  var fs = require('fs');
  var Handlebars =require('handlebars');
  var path =require('path');



  function isDir (file) {
    var isDir;

    try {
      isDir = fs.statSync(file).isDirectory();
    } catch (e) {
      console.error(e);
    }

    return isDir;
  }


  function isMarkdown (file) {
    return file.split('.md')[1] === '';
  }


  function classFromType (file) {

    var classname = '';

    if (isDir(file)) {
      return 'dir';
    }

    if (isMarkdown(file)) {
     return 'md';
    }

    return 'file';
  }


  function decorateFile (filepath) {
    return {
      path: '/' + filepath,
      name: path.basename(filepath),
      class: classFromType(filepath),
    };
  }

  function init (htmlTemplate) {

    return function dir (req, res, next) {

      var dir = '.' + req.originalUrl;

      if (dir.charAt(dir.length-1) === '/') {
        dir = dir.slice(0, dir.length-1);
      }

      var filelist = fs.readdirSync(dir);

      var files = filelist.map(function (filepath) {
        var relativeFilepath = dir + '/' + filepath;
        return decorateFile(relativeFilepath);
      });

      var data = {
        dirname: dir,
        files: files,
        processId: process.pid,
      };

      var template = Handlebars.compile(htmlTemplate);
      var result = template(data);

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(result);
      res.end();
    };

  }


  module.exports = init;

})();
