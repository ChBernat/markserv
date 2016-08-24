(function () {

  'use strict';

  var fs = require('fs');
  var Handlebars =require('handlebars');
  var marked = require('marked');
  var Promise = require('bluebird');


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

      var that = this;

        return new Promise(function (resolve, reject) {

        var filename = that.path.root + req.originalUrl;

        var markdownRaw = fs.readFileSync(filename).toString();

        return markdownToHtml(markdownRaw)
        .then(function (markdownHtml) {

          var data = {
            markdown: markdownHtml,
            markserv: that,
          };

          var template = Handlebars.compile(htmlTemplate);
          var result = template(data);

          // Pass Back to HTTP Request Handler or HTTP Exporter
          var payload = {
            statusCode: 200,
            contentType: 'text/html',
            data: result,
          };

          // return payload;
          resolve(payload);

        });

      });

    };

  }


  module.exports = init;

})();
