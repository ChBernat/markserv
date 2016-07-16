(function () {

  'use strict';

  var fs = require('fs');
  var Handlebars =require('handlebars');


  function init (htmlTemplate) {

    return function http404 (req, res, next) {

      var filename = '.' + req.originalUrl;


      var data = {
       filename: filename,
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
