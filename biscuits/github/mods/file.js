(function () {

  'use strict';

  var fs = require('fs');
  var Promise = require('bluebird');
  var send = require('send');
  var path = require('path');


  function init () {

    return function markdown (req, res, next) {
      var filename = '.' + req.originalUrl;

      send(req, path.basename(filename), {
        root:path.dirname(filename)
      })
      .pipe(res);
    };

  }


  module.exports = init;

})();
