(function () {

  'use strict';

  var send = require('send');
  var path = require('path');


  function init () {

    return function file (req, res) { // (req, res, next)

      var filename = this.path.root + req.originalUrl;

      // Send the file directly
      send(req, path.basename(filename), {
        root: path.dirname(filename)
      })
      .pipe(res);

      // Explicitly return nothing to the request handler
      return null;
    };

  }


  module.exports = init;

})();
