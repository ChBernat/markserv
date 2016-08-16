(function () {

  'use strict';

  var fs = require('fs');
  var Handlebars =require('handlebars');
  var marked = require('marked');
  var Promise = require('bluebird');
  var path = require('path');


  function markdownToHtml (markdownText) {
    return new Promise(function (resolve, reject) {
      marked(markdownText, function(err, data){
        if (err) {
          return reject(err);
        }

        resolve(data);
      });
    });
  }


  function init (htmlTemplate) {

    return function markdown (req, res, next) {

      var filename = this.path.root + req.originalUrl;
      var markdownRaw = fs.readFileSync(filename).toString();

      // This will need to handle various markdown extension types
      var filenameMeta = filename.replace('.md', '.meta.json');
      var postMeta = require(path.resolve(filenameMeta));

      markdownToHtml(markdownRaw)
      .then(function (markdownHtml) {

        // First compile the template
        var data = {
          markdown: markdownHtml,
          markserv: this,
          meta: postMeta,
        };

        // The first pass hooks the markdown block into the template
        var template = Handlebars.compile(htmlTemplate);
        var result = template(data);

        // The second pass fills the post with meta values
        // FIXME: Do this all in 1 pass?
        var markdownTemplate = Handlebars.compile(result);
        var finalResult = markdownTemplate(data);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(finalResult);
        res.end();

      });

    };

  }


  module.exports = init;

})();
