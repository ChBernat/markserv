(function () {

  'use strict';

  var fs = require('fs');
  var Handlebars =require('handlebars');
  var path = require('path');


  function init (htmlTemplate) {

    return function http404 (req, res, next) {

      var relativeFilepath = req.originalUrl;

      var data = {
       filename: relativeFilepath,
       markserv: this,
      };

      var template = Handlebars.compile(htmlTemplate);
      var result = template(data);

      // Pass Back to HTTP Request Handler or HTTP Exporter
      var payload =  {
        statusCode: 404,
        contentType: 'text/html',
        data: result,
      };

      return payload;

    };

  }


  module.exports = init;

})();
