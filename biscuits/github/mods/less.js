(function () {

  'use strict';

  var fs = require('fs');
  var lessc = require('less');


  function init () {

    return function less (req, res, next) {

      var filename = global.settingsPath + req.originalUrl;

      var lessRaw = fs.readFileSync(filename).toString();

      lessc.render(lessRaw)
      .then(function (data) {

        var css = data.css;

        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(css);
        res.end();

      });

    };

  }


  module.exports = init;

})();
