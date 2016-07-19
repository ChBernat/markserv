(function () {

  'use strict';

  var fs = require('fs');
  var Handlebars =require('handlebars');
  var path =require('path');
  var _ =require('underscore');


  function init (htmlTemplate) {

    return function dir (req, res, next) {

      var absoluteDirPath = this.path.root + req.originalUrl;

      var filelist = fs.readdirSync(absoluteDirPath);
      var root = isRoot(req);


      var files = filelist.map(function (file) {

        var relativeFilepath = root ? file : req.originalUrl + '/' + file;
        var absoluteFilepath = root ? absoluteDirPath + file : absoluteDirPath + '/' + file;

        var filetype = getType(absoluteFilepath);

        var filenameOutput = file;
        var fileclass = '';

        if (filetype.dir) {
          filenameOutput += '/';
          fileclass = 'dir';
        }

        if (filetype.markdown) {
          fileclass = 'markdown';
        }

        if (filetype.file) {
          fileclass = 'file';
        }

        // File object for handlebars template list
        return {
          path: relativeFilepath,
          name: filenameOutput,
          class: fileclass,
        };

      });


      var data = _.extend(this, {
        dir: req.originalUrl,
        files: files,
      });


      var template = Handlebars.compile(htmlTemplate);
      var result = template(data);

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(result);
      res.end();
    };

  }



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


  function getType (file) {

    var type = {};

    if (isDir(file)) {
      type.dir = true;
      return type;
    }

    if (isMarkdown(file)) {
      type.markdown = true;
      return type;
    }

    type.file = true;
    return type;
  }


  function nameFromType (file) {

    if (isDir(file)) {
      return file + '/';
    }

    return file;
  }


  function isRoot (req) {
    return req.originalUrl === '/';
  }



  module.exports = init;

})();
