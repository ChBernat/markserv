// UNRELATED RANDOM THINGS
///////////////////////////////////////////////////////////////////////////////////////////////////

//   function pathFromFile (file) {
//     return file.substr(0, file.lastIndexOf('/') + 1);
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







// BLOG BISCUIT RELATED THINGS
///////////////////////////////////////////////////////////////////////////////////////////////////




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




// SMACKDOWN REALTED THINGS
///////////////////////////////////////////////////////////////////////////////////////////////////



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

