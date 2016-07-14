#!/usr/bin/env node

(function (){

  'use strict';

  // Requirements

  var Promise = require('bluebird');
  var fs        = require('fs');
  var _         = require('underscore');
  var minimatch = require('minimatch');
  var cheerio = require('cheerio');
  var path = require('path');
  var marked = require('marked');
  var less = require('less');
  var jsdom = require('jsdom');
  var ansi = require('ansi');
  var cursor = ansi(process.stdout);
  var flags = require('commander');
  var pkg = require('./package.json');



  // Path Variables

  // var GitHubStyle = __dirname+'/less/github.less',
    // scriptPath = __dirname+'/script/script.js';

  var defaultSettings = __dirname + '/examples/github/settings.json';

  // Options

  flags.version(pkg.version)
    .option('--settings [type]', 'Path to settings.json file', defaultSettings)

    .option('-d, --dir [type]', 'Serve from directory [dir]', './')
    // .option('-w, --domain [type]', 'https://www.your-domain.com.', null)
    .option('-a, --address [type]', 'Serve on ip/address [address]', 'localhost')
    .option('-p, --port [type]', 'Serve on port [port]', '8080')
    .option('-l, --livereloadport [type]', 'LiveReload port [port]', '35729')
    // .option('-b, --blog [type]', 'Blog settings file .json file', null)
    // .option('-h, --header [type]', 'Header .md file', null)
    // .option('-f, --footer [type]', 'Footer .md file', null)
    // .option('-n, --navigation [type]', 'Navigation .md file', null)
    // // .option('-s, --less [type]', 'Path to Less styles [less]', GitHubStyle)
    // .option('-f, --file [type]', 'Open specific file in browser [file]')
    .option('-x, --x', 'Don\'t open browser on run.')
    // .option('-e, --exporthtml', 'Export to static Html.')
    // .option('-v, --verbose', 'verbose output')
    .parse(process.argv);

  global.flags = flags;
  console.log(global.flags.port);
  console.log(global.flags.address);

  // Load Core Markserv Modules
  var requestHandler = require('./core/requestHandler.js');
  var server = require('./core/server.js');

  // Begin the server
  server.start(requestHandler);


  // var dir = flags.dir;
  // var cssPath = flags.less;

  // console.log(settings);



  // function Markserv () {
  //   return {
  //     settings: require(flags.settings),
  //     core:
  //   };
  // }

  // global.markserv = {
  //   plugins: {
  //   },
  // };

  // var httpRequestHandler = require('./request-handler.core.js');

  // var core = require('./core/core.js')(markserv);

  // var core = require('./core/core.js')(markserv);


  // core.loadplugin([
  //   './plugins/dir.plugin.js',
  // ]);





    // Promise.resolve(listDir(dir))
    //  .then(collectFiles)
    //  .then(flattenTree)
    //  .then(exportToHtml)
    //  .then(function (data) {
    //     console.log(data);
    //   })
    //  .catch(function (reason) {
    //    console.log(reason);
    //  });


//   function pathFromFile (file) {
//     return file.substr(0, file.lastIndexOf('/') + 1);
//   }


//   if (flags.blog) {
//     var settings = require(flags.blog);

//     var blogData = settings;

//     var settingsPath = pathFromFile(flags.blog);
//     var indexFile = settingsPath + settings.index;
//     var indexPath = pathFromFile(indexFile);

//     getFile(indexFile)
//     .then(function(html){
//       console.log(html);

//       // Load the HTML file into Cheerio DOM parser
//       var $ = cheerio.load(html);
//       console.log(html);

//       // Directory relative to the file
//       var filedir = indexPath;

//       // Scan an HTML file for comment nodes that contain "include" Eg: <!--include|page.html-->
//       var nodeCount = 0;
//       var includeCount = 0;
//       var includeSuccessCount = 0;

//       function filterHtml (elem, dir) {
//         nodeCount += 1;
//         // console.log(dir);

//         if (elem.hasOwnProperty('children')) {
//           var length = elem.children.length;
//           var i = 0;

//           for(; i< length; i +=1) {
//             var childNode = elem.childNodes[i];
//             filterHtml(childNode, dir);

//             // File include comment
//             if (isIncludeComment(childNode)) {
//               includeCount += 1;
//               var include = parseInclude(childNode, dir);

//              // if no error reading file
//               if (include.contents) {
//                 var rootNode = cheerio.load(include.contents)._root.children[0];
//                 $(childNode).replaceWith(rootNode);
//                 filterHtml(rootNode, include.dir);
//                 includeSuccessCount += 1;
//               }
//             }

//             // Data comment
//             if (isDataComment(childNode)) {
//               // includeCount += 1;

//               var dataType = getDataType(childNode);

//               if (dataType && blogData.hasOwnProperty(dataType)){
//                 var dynamicContent = blogData[dataType];
//                 $(childNode).replaceWith(dynamicContent);
//               }


//             }

//           }
//         }

//         return elem;
//       }


//       // Begin searching for comments
//       filterHtml($._root, filedir);

//       console.log('Processed ' + nodeCount + ' DOM nodes in: ' + indexFile);
//       console.log('Found ' + includeCount + ' include comments in: ' + indexFile);
//       console.log('Include errors: ' + (includeCount - includeSuccessCount) + ' in: ' + indexFile);

//       // // Write out the resulting HTML
//       var htmlOutput = $.html();
//       console.log(htmlOutput);
//     });
//   }

//   function getDataType (childNode) {
//     var dataType = childNode.data
//       .slice(childNode.data.lastIndexOf(':')+1)
//       .replace(/\s+/g, '');

//     return dataType;
//   }



//   function parseInclude (childNode, dir) {
//     var incFileName = relativeFilename(childNode);
//     var incFilePath = dir + incFileName;
//     var incFileContents = readContents(incFilePath);

//     // The new include may change the relative path of it's child nodes
//     var incFileDir = path.dirname(incFilePath);

//     return {
//       filename: incFileName,
//       contents: incFileContents,
//       dir: incFileDir,
//     };
//   }



//   function readContents (fpath) {
//     return fs.readFileSync(fpath).toString();
//     // if (!grunt.file.exists(fpath)) {
//     //   grunt.log.warn('Source file "' + fpath + '" not found.');
//     //   return false;
//     // } else {
//     //   return grunt.file.read(fpath);
//     // }
//   }


//   function isIncludeComment (node) {
//     if (node.type !== 'comment') {
//       return false;
//     }

//     // Look for "include" between "<!--" and the ":" colon
//     var tagRef = node.data
//       .slice(0, node.data.indexOf(':'))
//       .replace(/\s+/g, '')
//       .toLowerCase();

//     if (tagRef !== 'include') {
//       return false;
//     } else {
//       return true;
//     }
//   }


//   function isDataComment (node) {
//     if (node.type !== 'comment') {
//       return false;
//     }

//     // Look for "data" between "<!--" and the ":" colon
//     var tagRef = node.data
//       .slice(0, node.data.indexOf(':'))
//       .replace(/\s+/g, '')
//       .toLowerCase();

//     if (tagRef !== 'data') {
//       return false;
//     } else {
//       return true;
//     }
//   }


//   function relativeFilename (elem) {
//     // Get everything before the colon, remove the whitespace
//     var filename = elem.data
//       .slice(elem.data.lastIndexOf(':')+1)
//       .replace(/\s+/g, '');

//     console.log('Found include tag: ' + filename);

//     return filename;
//   }



//   // Returns string 'file' or 'dir' (based on lstat)
//   function isFileOrDir (pathAndFile) {
//     var stats = fs.lstatSync(pathAndFile);

//     if (stats.isFile()) {
//       return 'file';
//     } else if (stats.isDirectory()) {
//       return 'dir';
//     }
//   }



//   // Returns a nested array of all files (recursive)
//   function collectFiles (dirList) {

//     var files = {'.':[]},
//       path = dirList.path,
//       type,
//       file;

//     dirList.files.forEach(function (filename) {

//       file = path+'/'+filename;
//       type = isFileOrDir(file);

//       switch (type) {
//         case 'dir':
//           files[file] = collectFiles(listDir(file));
//           break;

//         case 'file':
//           if (file.indexOf('.md')>-1)
//             files['.'].push(file);
//           break;
//       }
//     });

//     return files;
//   }



//   // Lists dir files and sub-dirs (exludes . & .. )
//   function listDir (dir) {
//     return {
//       path: dir,
//       files: fs.readdirSync(dir)
//     };
//   }

//   // Flattens a nested file array by an extension type
//   function flatten (ary) {
//     return _.flatten(ary);
//   }

//   function typeOf (item) {
//     var type = Object.prototype.toString.call(item).split(' ')[1];
//     return type.substr(0, type.length-1).toLowerCase();
//   }

//   function flattenTree (branch, list) {
//     var list = list || [],
//       path,
//       item;

//     for (path in branch) {
//       item = branch[path];

//       switch (typeOf(item)) {

//         case 'array':
//         case 'object':
//           list.concat(flattenTree(item, list));
//           break;

//         case 'string':
//           list.push(item);
//           break;
//       }
//     }

//     return list;
//   }

//   function exportToHtml (files) {
//     return new Promise(function (resolve, reject){

//       files.forEach(function (filename) {
//         console.log(filename);
//       });

//       resolve(true);
//     });
//   }











//   // Terminal Output Messages

//   function msg(type){
//     return cursor
//       .bg.green()
//       .fg.black()
//       .write(' Markserv ')
//       .reset()
//       .fg.white()
//       .write(' '+type+': ')
//       .reset()
//       ;
//   }


//   function boohoo(type){
//     return cursor
//       .bg.red()
//       .fg.black()
//       .write(' Markserv ')
//       .reset()
//       .write(' ')
//       .fg.black()
//       .bg.red()
//       .write(' '+type+': ')
//       .reset()
//       .fg.red()
//       .write(' ')
//       ;
//   }




//   // getFile: reads utf8 content from a file

//   function getFile(path){
//     return new Promise(function (resolve, reject) {
//       fs.readFile(path, 'utf8', function(err, data){
//         if (err) return reject(err);
//         resolve(data);
//       });
//     });
//   }


//   // Get Custom Less CSS to use in all Markdown files

//   function buildStyleSheet (cssPath) {
//     return new Promise(function (resolve, reject) {
//       getFile(cssPath).then(function(data){
//         less.render(data).then(function(data){
//           resolve(data.css);
//          });
//       });
//     });
//   }



//   // linkify: converts github style wiki markdown links to .md links

//   function linkify(body){
//     return new Promise(function (resolve, reject) {
//       jsdom.env(body, function (err, window) {
//         if (err) return reject(err);

//         var links = window.document.getElementsByTagName('a'),
//           i=0,
//           l=links.length,
//           href,
//           link,
//           markdownFile,
//           mdFileExists,
//           relativeURL,
//           isFileHref;

//         for (; i< l; i++) {
//           link = links[i];
//           href = link.href;
//           isFileHref = href.substr(0,8) ==='file:///';

//           markdownFile = href.replace('file://'+__dirname, flags.dir)+'.md';
//           mdFileExists = fs.existsSync(markdownFile);

//           if (isFileHref && mdFileExists) {
//             relativeURL = href.replace('file://'+__dirname, '')+'.md';
//             link.href=relativeURL;
//           }
//         }

//         var html = window.document.getElementsByTagName('body')[0].innerHTML;

//         resolve(html);
//       });
//     });
//   }


//   // Makes links for HTML exports
//   function makeHtmlLinks (html) {
//     return new Promise(function (resolve, reject) {

//       jsdom.env(html, ["http://code.jquery.com/jquery.js"], function (err, window) {
//         if (err!==null) return reject(err);
//         var $ = window.$;
//         $("a").each(function () {

//           var $link = $(this),
//             href  = $link.attr('href');

//           $link.attr('href', href.substr(0, href.lastIndexOf('.'))+'.html');
//         });
//         resolve($('html').html());
//       });

//     });
//   }

//   // buildHTMLFromMarkDown: compiles the final HTML/CSS output from Markdown/Less files, includes JS

//   function buildHTMLFromMarkDown(markdownPath){
//     return new Promise(function (resolve, reject) {

//       var stack = [
//         buildStyleSheet(cssPath),

//         // Article
//         getFile(markdownPath)
//           .then(markdownToHTML)
//           .then(linkify),

//         // Header
//         flags.header && getFile(flags.header)
//           .then(markdownToHTML)
//           .then(linkify),

//         // Footer
//         flags.footer && getFile(flags.footer)
//           .then(markdownToHTML)
//           .then(linkify),

//         // Navigation
//         flags.navigation && getFile(flags.navigation)
//           .then(markdownToHTML)
//           .then(linkify),
//       ];

//       Promise.all(stack).then(function (data) {

//         var css = data[0];
//         var html_body = data[1];

//         var header, footer, navigation, canconical, comments, image;

//         if (flags.header) header = data[2];
//         if (flags.footer) footer = data[3];
//         if (flags.navigation) navigation = data[4];

//         var output_html;
//         var dirs = markdownPath.split('/');



//         var title = dirs[dirs.length-1].split('.md')[0];
//         title = title.replace(/-/g, ' ');
//         title = title.split(' ').map(function (word) {
//           var firstChar = word.substr(0, 1);
//           return firstChar.toUpperCase() + word.substr(1);
//         }).join(' ');


//         if (flags.domain) {
//           var path = dirs.splice(2);
//           var uri = path.join('/').replace('.md','.html');
//           canconical = flags.domain + uri;

//           comments = '<section id="comments"> \n\
//             <div id="disqus_thread"></div> \n\
//             <script> \n\
//             var disqus_config = function () { \n\
//               this.page.url = "'+canconical+'"; \n\
//               this.page.identifier = "'+title+'"; \n\
//             }; \n\
//             (function() { \n\
//                 var d = document, s = d.createElement("script"); \n\
//                 s.src = "//pwn-io.disqus.com/embed.js"; \n\
//                 s.setAttribute("data-timestamp", +new Date()); \n\
//                 (d.head || d.body).appendChild(s); \n\
//             })(); \n\
//             </script> \n\
//             <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript> \n\
//             <script id="dsq-count-scr" src="//pwn-io.disqus.com/count.js" async></script></section>\n';

//           image = canconical.replace('.html', '.jpg');
//         }


//         if(flags.less === GitHubStyle){
//           output_html = '<!DOCTYPE html>' +
//             '<head>' +
//             '<title>'+title+'</title>' +
//             '<meta charset="utf-8">' +
//             '<style>'+css+'</style>' +
//             '<link rel="stylesheet" href="//sindresorhus.com/github-markdown-css/github-markdown.css">' +
//             '<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>'+
//             '<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js"></script>'+
//             '<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/github-gist.css">' +
//             '</head>' +
//             '<body><article class="markdown-body">'+html_body+'</article></body>'+
//             '<script src="http://localhost:35729/livereload.js?snipver=1"></script>'+
//             '<script>hljs.initHighlightingOnLoad();</script>';
//         } else {
//           output_html = '<!DOCTYPE html>' +
//             '<head>' +
//             '<title>'+title+'</title>' +

//             // Canconical blog links
//             (canconical ? '<link rel="canonical" href="'+canconical+'" />' : '' )+
//             (canconical ? '<meta property="og:title" content="'+title+'" />' : '' )+
//             (canconical ? '<meta property="og:type" content="blog"/>' : '' )+
//             (canconical ? '<meta property="og:site_name" content="Places Without Names - The weblog of a software developer, Alistair G MacDonald"/>' : '' ) +
//             (canconical ? '<meta property="og:url" content="'+canconical+'"/>' : '' ) +
//             (canconical ? '<meta property="og:image" content="'+image+'"/>' : '' ) +

//             '<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>'+
//             '<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js"></script>'+
//             '<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/github-gist.css">' +
//             '<meta charset="utf-8">' +
//             '<style>'+css+'</style>' +
//             '<script type="text/javascript" src="https://ws.sharethis.com/button/buttons.js"></script>' +
//             '<script type="text/javascript">stLight.options({publisher: "a3e2f080-726c-46a2-bc33-791496cf388d", doNotHash: false, doNotCopy: false, hashAddressBar: true});</script>' +
//             '</head>' +
//             '<body>'+
//               '<div class="container">' +
//                 (header ? '<header>' + header + '</header>' : '' ) +
//                 (navigation ? '<nav>' + navigation + '</nav>' : '' ) +
//                 '<article>' + html_body + '</article>' +
//                 '<section id="share"><p>' +
//                   '<span class="st_facebook_hcount" displayText="Facebook"></span>' +
//                   '<span class="st_twitter_hcount" displayText="Tweet"></span>' +
//                   '<span class="st_googleplus_hcount" displayText="Google +"></span>' +
//                   '<span class="st_linkedin_hcount" displayText="LinkedIn"></span>' +
//                 '</p></section>' +
//                 (comments ? comments : '' ) +
//                 (footer ? '<footer>' + footer + '</footer>' : '' ) +
//               '</div>' +
//              '</body>'+
//             '<script src="http://localhost:35729/livereload.js?snipver=1"></script>' +
//             '<script>hljs.initHighlightingOnLoad();</script>';

//         }

//         resolve(output_html);
//       });
//     });
//   }


//   // markdownToHTML: turns a Markdown file into HTML content

//   function markdownToHTML(markdownText){
//     return new Promise(function (resolve, reject) {
//       marked(markdownText, function(err, data){
//         if (err) return reject(err);
//         resolve(data);
//       });
//     });
//   }


//   // markItDown: begins the Markdown compilation process, then sends result when done...

//   function compileAndSendMarkdown(path, res){
//     buildHTMLFromMarkDown(path)
//     .then(function(html){
//       res.writeHead(200);
//       res.end(html);

//     // Catch if something breaks...
//     }).catch(function(err){
//       msg('error')
//       .write('Can\'t build HTML: ', err)
//       .reset().write('\n');
//     });
//   }






//   function compileAndSendDirectoryListing (path, res) {
//     var urls = fs.readdirSync(path);
//     var list = '<ul>\n';

//     urls.forEach(function(subPath){
//       var dir = fs.statSync(path+subPath).isDirectory();
//       var href;
//       if (dir){
//         href=subPath+'/';
//         list+='\t<li class="dir"><a href="'+href+'">'+href+'</a></li> \n';
//       }else{
//         href=subPath;

//         if(subPath.split('.md')[1]===''){
//           list+='\t<li class="md"><a href="'+href+'">'+href+'</a></li> \n';
//         }else{
//           list+='\t<li class="file"><a href="'+href+'">'+href+'</a></li> \n';
//         }
//       }
//     });

//     list += '</ul>\n';

//     buildStyleSheet(cssPath).then(function (css) {
//       var html = '<!DOCTYPE html>' +
//         '<head>' +
//         '<title>'+(path.slice(2))+'</title>' +
//         '<meta charset="utf-8">' +
//         '<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>'+//
//         '<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js"></script>'+
//         '<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/default.min.css">' +
//         '<link rel="stylesheet" href="//highlightjs.org/static/demo/styles/github-gist.css">' +
//         '<link rel="shortcut icon" type="image/x-icon" href="https://cdn0.iconfinder.com/data/icons/octicons/1024/markdown-128.png" />' +
//         '<style>'+(css)+'</style>' +
//         '</head>' +
//         '<body>'+
//           '<article class="markdown-body">'+
//             '<h1>Index of '+(path.slice(2))+'</h1>'+
//             list+
//             '<sup><hr> Served by <a href="https://www.npmjs.com/package/markserv">MarkServ</a> | '+process.pid+'</sup>'+
//           '</article>'+
//          '</body>'+
//         '<script src="http://localhost:35729/livereload.js?snipver=1"></script>';

//       // Log if verbose

//       if (flags.verbose){
//         msg('index').write(path).reset().write('\n');
//       }

//       // Send file
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       res.write(html);
//       res.end();
//     });
//   }


})();
