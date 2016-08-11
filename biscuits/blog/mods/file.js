(function () {

  'use strict';

  var send = require('send');
  var path = require('path');


  function init () {

    return function file (req, res) { // (req, res, next)

      var filename = this.path.root + req.originalUrl;

      send(req, path.basename(filename), {
        root: path.dirname(filename)
      })
      .pipe(res);
    };

  }


  module.exports = init;

})();
