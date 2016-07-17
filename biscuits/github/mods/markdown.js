(function () {

  'use strict';

  var fs = require('fs');
  var Handlebars =require('handlebars');
  var marked = require('marked');
  var Promise = require('bluebird');


  function markdownToHtml (markdownText) {
    return new Promise(function (resolve, reject) {
      marked(markdownText, function(err, data){
        if (err) return reject(err);
        resolve(data);
      });
    });
  }


  function init (htmlTemplate) {

    return function markdown (req, res, next) {

      var filename = global.settingsPath + req.originalUrl;

      var markdownRaw = fs.readFileSync(filename).toString();


      markdownToHtml(markdownRaw)
      .then(function (markdownHtml) {

        var data = {
          markdown: markdownHtml,
        };

        var template = Handlebars.compile(htmlTemplate);
        var result = template(data);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(result);
        res.end();

      });

    };

  }


  module.exports = init;

})();
