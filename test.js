(function () {

  'use strict';

  var Promise = require('bluebird');


  function process (r) {
    return new Promise(function (resolve, reject) {
      resolve(r);
    });
  }


  function filtexr () {
    return new Promise(function (resolve, reject) {

      var ps = [];

      ps.push(process(1));
      ps.push(process(2));
      ps.push(process(3));
      ps.push(process(4));
      ps.push(process(5));

      Promise.all(ps).then(function () {
        resolve();
      });
    });
  }


  filtexr(123).then(function (data) {
    console.log('Done.');
  }).catch(function (reason) {
    console.log('#fail');
    console.log(reason);
  });

})();
