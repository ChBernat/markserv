(function () {

  'use strict';

  var fs = require('fs');
  var lessc = require('less');


  function init () {

    return function less (req, res) { // (req, res, next)

      var filename = this.path.root + req.originalUrl;

      var lessRaw = fs.readFileSync(filename).toString();

      lessc.render(lessRaw)
      .then(function (data) {

        var css = data.css;

        // Pass Back to HTTP Request Handler or HTTP Exporter
        var payload =  {
          statusCode: 200,
          contentType: 'text/css',
          data: result,
        };

        return payload;

      });

    };

  }


  module.exports = init;

})();
