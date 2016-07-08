(function () {

  'use strict';

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


  var Promise = require('bluebird');
  var connect = require('connect');
  var http = require('http');
  var openPort = require('openport');
  var open = require("open");
  var liveReload = require('livereload');
  var connectLiveReload = require('connect-livereload');

  var http_request_handler = require('./core.http-request-handler.js').handle;

  var flags = global.flags;

  var PORT_RANGE = {
    HTTP: [8000, 8100],
    LIVE_RELOAD: [35729, 35829]
  };


  var LIVE_RELOAD_PORT,
      LIVE_RELOAD_SERVER,
      HTTP_PORT,
      HTTP_SERVER,
      CONNECT_APP;


  // Initialize MarkServ

  findOpenPort(PORT_RANGE.LIVE_RELOAD)
    .then(setLiveReloadPort)
    .then(startConnectApp)
    .then(function(){
      findOpenPort(PORT_RANGE.HTTP)
      .then(setHTTPPort)
      .then(startHTTPServer)
      .then(startLiveReloadServer)
      .then(serversActivated);
    });


  function findOpenPort(range){
    return new Promise(function (resolve, reject) {
      openPort.find({startingPort: range[0], endingPort: range[1]},
        function(err, port) {
          if(err) return reject(err);
          resolve(port);
        }
      );
    });
  }

  function setLiveReloadPort(port){
    return new Promise(function (resolve, reject) {
      LIVE_RELOAD_PORT = port;
      resolve(port);
    });
  }

  function setHTTPPort(port){
    return new Promise(function (resolve, reject) {
      HTTP_PORT = port;
      resolve(port);
    });
  }


  function startConnectApp(live_reload_port){
    return new Promise(function (resolve, reject) {
      CONNECT_APP = connect()
        .use('/', http_request_handler)
        .use(connectLiveReload({
          port: LIVE_RELOAD_PORT
        }));
      resolve(CONNECT_APP);
    });
  }

  function startHTTPServer(){
    return new Promise(function (resolve, reject) {
      HTTP_SERVER = http.createServer(CONNECT_APP);
      HTTP_SERVER.listen(HTTP_PORT, flags.address);
      resolve(HTTP_SERVER);
    });
  }


  function startLiveReloadServer(){
    return new Promise(function (resolve, reject) {

      LIVE_RELOAD_SERVER = liveReload.createServer({
        exts: watchExtensions,
        port: LIVE_RELOAD_PORT
      }).watch(flags.dir);

      resolve(LIVE_RELOAD_SERVER);
    });
  }


  function serversActivated(){

    var address = HTTP_SERVER.address();

    //console.log(address);
    //var urlSafeAddress = address && address.address === "::" ? "localhost" : address.address || flags.address;

    var serveURL = 'http://'+flags.address+':'+HTTP_PORT;
    console.log(serveURL);

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

  module.exports = {
  };

})();

