(function () {

  'use strict';

  var Promise = require('bluebird');
  var connect = require('connect');
  var http = require('http');
  var liveReload = require('livereload');
  var connectLiveReload = require('connect-livereload');

  var flags = global.markserv.flags;

  var Server = {

    // Starts the server
    start: function (requestHandler) {

      return startConnectApp({
        liveReloadPort: flags.livereloadport,
        requestHandler: requestHandler.processRequest,
      })
      .then(startHTTPServer)
      .then(startLiveReloadServer);

    },

  };

  module.exports = Server;

  // Markdown Extension Types

  var markdownExtensions = [
    '.markdown',
    '.mdown',
    '.mkdn',
    '.md',
    '.mkd',
    '.mdwn',
    '.mdtxt',
    '.mdtext',
    '.text',
  ];

  var watchExtensions = markdownExtensions.concat([
    '.less',
    '.js',
    '.css',
    '.html',
    '.htm',
    '.json',
    '.gif',
    '.png',
    '.jpg',
    '.jpeg',
  ]);









  function startConnectApp (props) {
    return new Promise(function (resolve, reject) {

      var connectApp = connect()
        .use('/', props.requestHandler)
        .use(connectLiveReload({
          port: props.liveReloadPort
        }));

      resolve({
        connectApp: connectApp
      });

    });
  }

  function startHTTPServer (props) {
    return new Promise(function (resolve, reject) {
      var HTTP_SERVER = http.createServer(props.connectApp);
      HTTP_SERVER.listen(flags.port, flags.address);
      resolve(HTTP_SERVER);
    });
  }


  function startLiveReloadServer(){
    return new Promise(function (resolve, reject) {

      var LIVE_RELOAD_SERVER = liveReload.createServer({
        exts: watchExtensions,
        port: flags.livereloadport,
      }).watch(flags.dir);

      resolve(LIVE_RELOAD_SERVER);
    });
  }

})();

