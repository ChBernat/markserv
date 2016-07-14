(function () {

  'use strict';

  var Promise = require('bluebird');
  var connect = require('connect');
  var http = require('http');
  var open = require("open");
  var liveReload = require('livereload');
  var connectLiveReload = require('connect-livereload');

  var flags = global.flags;

  var Server = {

    // Starts the server
    start: function (requestHandler) {
      console.log(requestHandler);

      startConnectApp({
        liveReloadPort: global.flags.livereloadport,
        requestHandler: requestHandler,
      })
      .then(startHTTPServer)
      .then(startLiveReloadServer)
      .then(serversActivated);

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
      HTTP_SERVER.listen(global.flags.port, global.flags.address);
      resolve(HTTP_SERVER);
    });
  }


  function startLiveReloadServer(){
    return new Promise(function (resolve, reject) {

      var LIVE_RELOAD_SERVER = liveReload.createServer({
        exts: watchExtensions,
        port: global.flags.livereloadport,
      }).watch(flags.dir);

      resolve(LIVE_RELOAD_SERVER);
    });
  }


  function serversActivated(){

    // var address = HTTP_SERVER.address();

    //console.log(address);
    //var urlSafeAddress = address && address.address === "::" ? "localhost" : address.address || flags.address;

    // var serveURL = 'http://'+flags.address+':'+HTTP_PORT;
    // console.log(serveURL);

    // msg('start')
    //  .write('serving content from ')
    //  .fg.white().write(path.resolve(flags.dir)).reset()
    //  .write(' on port: ')
    //  .fg.white().write(''+HTTP_PORT).reset()
    //  .write('\n');

    // msg('address')
    //  .underline().fg.white()
    //  .write(serveURL).reset()
    //  .write('\n');

    // var startMsg = 'serving content from "'+flags.dir+'" on port: '+HTTP_PORT;

    // msg('less')
    //  .write('using style from ')
    //  .fg.white().write(flags.less).reset()
    //  .write('\n');

    // msg('livereload')
    //   .write('communicating on port: ')
    //   .fg.white().write(LIVE_RELOAD_PORT+'').reset()
    //   .write('\n');

    // if (process.pid) {
    //   msg('process')
    //     .write('your pid is: ')
    //     .fg.white().write(process.pid+'').reset()
    //     .write('\n');

    //   msg('info')
    //     .write('to stop this server, press: ')
    //     .fg.white().write('[Ctrl + C]').reset()
    //     .write(', or type: ')
    //     .fg.white().write('"kill '+process.pid+'"').reset()
    //     .write('\n');
    // }

    // if (flags.file){
    //   open(serveURL+'/'+flags.file);
    // } else {
    //   if (!flags.x){
    //     open(serveURL);
    //   }
    // }
  }

})();

