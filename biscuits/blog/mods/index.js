(function () {

  'use strict';

  var fs = require('fs');
  var Handlebars =require('handlebars');


  function init (htmlTemplate) {

    return function index (req, res, next) {

      var filename = this.root && this.root || '' + req.originalUrl;

      var data = {
       filename: filename,
       markserv: this,
      };

      var template = Handlebars.compile(htmlTemplate);
      var result = template(data);

      // Pass Back to HTTP Request Handler or HTTP Exporter
      var payload =  {
        statusCode: 200,
        contentType: 'text/html',
        data: result,
      };

      return payload;

    };

  }


  module.exports = init;

})();
