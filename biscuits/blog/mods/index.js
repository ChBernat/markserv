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

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(result);
      res.end();
    };

  }


  module.exports = init;

})();
