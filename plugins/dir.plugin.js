(function () {

  'use strict';

  var fs = require('fs');

  function dir (path, req, res, next) {

    var urls = fs.readdirSync(path);
    // var list = '<ul>\n';

    // urls.forEach(function(subPath){
    //   var dir = fs.statSync(path+subPath).isDirectory();
    //   var href;
    //   if (dir){
    //     href=subPath+'/';
    //     list+='\t<li class="dir"><a href="'+href+'">'+href+'</a></li> \n';
    //   }else{
    //     href=subPath;

    //     if(subPath.split('.md')[1]===''){
    //       list+='\t<li class="md"><a href="'+href+'">'+href+'</a></li> \n';
    //     }else{
    //       list+='\t<li class="file"><a href="'+href+'">'+href+'</a></li> \n';
    //     }
    //   }
    // });

    // list += '</ul>\n';

    // buildStyleSheet(cssPath).then(function (css) {
    //   var html = '<!DOCTYPE html>' +
    //     '<head>' +
    //     '<title>'+(path.slice(2))+'</title>' +
    //     '<meta charset="utf-8">' +
    //     '<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>'+//
    //     '<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js"></script>'+
    //     '<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/default.min.css">' +
    //     '<link rel="stylesheet" href="//highlightjs.org/static/demo/styles/github-gist.css">' +
    //     '<link rel="shortcut icon" type="image/x-icon" href="https://cdn0.iconfinder.com/data/icons/octicons/1024/markdown-128.png" />' +
    //     '<style>'+(css)+'</style>' +
    //     '</head>' +
    //     '<body>'+
    //       '<article class="markdown-body">'+
    //         '<h1>Index of '+(path.slice(2))+'</h1>'+
    //         list+
    //         '<sup><hr> Served by <a href="https://www.npmjs.com/package/markserv">MarkServ</a> | '+process.pid+'</sup>'+
    //       '</article>'+
    //      '</body>'+
    //     '<script src="http://localhost:35729/livereload.js?snipver=1"></script>';

    //   // Log if verbose

    //   // if (flags.verbose){
    //     // msg('index').write(path).reset().write('\n');
    //   // }

      // Send file
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(urls.toString());
      res.end();
    // });
  }

  module.exports = {
    name: 'dir',
    template: 'dir.template.html',
    func: dir,
  };

})();
