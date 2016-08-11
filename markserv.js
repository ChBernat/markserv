#!/usr/bin/env node

(function (){

  'use strict';

  var log = require('./core/log.js');
  var pkg = require('./package.json');
  var Promise = require('bluebird');
  var commander = require('commander');
  var path = require('path');
  var open = require('open');
  require('./core/colors.js');

  // Serve Github Flavor setings be default
  var defaultSettings = __dirname + '/biscuits/github/settings.js';

  commander.version(pkg.version)
    .option('-s, --settings [type]', 'Path to settings.json file', defaultSettings)
    .option('-d, --dir [type]', 'Serve from directory [dir]', './')
    .option('-a, --address [type]', 'Serve on ip/address [address]', 'localhost')
    .option('-p, --port [type]', 'Serve on port [port]', '8080')
    .option('-r, --livereloadport [type]', 'LiveReload port [port]', '35729')
    .option('-z, --z', 'Do not open the browser.')
    .option('-x, --exporthtml', 'Export static HTML files.')
    .option('-l, --loglevel [type]', 'Verbosity of log messages.', '3')
    .parse(process.argv);

  var flags = commander;

  // Hook the logger up to the goads
  log.setLevel(flags.loglevel);

  var settingsPath = path.dirname(path.resolve(flags.settings));
  var settings = require(flags.settings);

  console.log(settingsPath);
  console.log(settings);

  // It is intentional that I serve the settings on a global namespace.
  // I do this for maintainability purposes, I do not consider it fit
  // to pass variables through many levels of a promise tree. If there
  // is a better way to do this, let me know.

  // "markserv"  is the *only* global namespace that should be used.
  global.markserv = {
    flags: flags,
    pid: process.pid,
    url: 'http://' + flags.address + ':' + flags.port,
    path: {
      root: commander.dir,
      biscuit: path.dirname(settingsPath),
    },
    settings: settings,
    settingsPath: settingsPath
  };




  // Compile HTML with nested includes
  var htmlParser = require('./core/htmlParser/htmlParser.js').parse;

  function requireModule (mapName) {
    var modulePath = mapName.module;
    var activeModule = require(settingsPath + '/' + modulePath);
    return activeModule;
  }



  function compileTemplate (mapName) {
    if (mapName.hasOwnProperty('template')) {
      var templateFilepath = settingsPath + '/' + mapName.template;
      return htmlParser(templateFilepath);
    }

    // No template renderer for this type
    return false;
  }


  function loadModule (name) {
    return new Promise(function (resolve, reject) {
      log.trace('loadModule '.white + ''.reset + name);

      var promiseStack = [
        compileTemplate(name),
        requireModule(name),
      ];

      Promise.all(promiseStack)
      .then(function (result) {

        var compiledTemplate = result[0];
        var loadedModule = result[1];

        var module = loadedModule(compiledTemplate);
        resolve(module);

      })
      .catch(function (reason) {
        log.error(reason);
        reject(reason);
      });

    });
  }



  function mapModules () {
    return new Promise(function (resolve, reject) {

      var map = {};

      var promiseStack = [];

      function newPromise (moduleName) {
        return function () {
          var deferred = Promise.defer();

          // log verbose loading module name

          var modulePath = settings.map[moduleName];

          loadModule(modulePath)
          .then(function (loadedModule) {
            map[moduleName] = loadedModule;
            log.trace('Loaded module: ' + moduleName);
            deferred.resolve(loadedModule);
          }, function (reason) {
            deferred.reject(reason);
          });
          return deferred.promise;
        };
      }


      for (var moduleName in settings.map) {
        if (settings.map.hasOwnProperty(moduleName)) {
          promiseStack.push(newPromise(moduleName));
        }
      }

      var fire = function () {
        if (promiseStack.length) {
          promiseStack.shift()()
            .then(function () {
              return fire();
            }).catch(function (reason) {
              reject(reason);
            });
         } else {
           resolve(map);
         }
      };

      return fire();
    });
  }


  function startServer (moduleMap) {
    return new Promise(function (resolve, reject) {

      var requestHandler = require('./core/httpServer/requestHandler.js');
      requestHandler.setContext(global.markserv);
      requestHandler.mapModules(moduleMap);

      var server = require('./core/httpServer/server.js');

      // Begin the server
      var liveServer =  server.start(requestHandler);

      // Log server details
      log.log('http server started'.white);
      log.log('press ' + ('[Ctrl + C]'.white) + ' or ' + ('kill '+process.pid).white + ''.reset + ' to stop');
      log.log('dir ' + path.resolve(flags.dir).white.underline);
      log.log('url ' + global.markserv.url.white.underline);
      log.log('pid ' + (''+process.pid).white);
      log.log('settings ' + (settingsPath).white.underline);

      if (liveServer) {
        resolve(liveServer);
      } else {
        reject(liveServer);
      }
    });
  }


  function openBrowser () {
    if (!flags.z) {
      open(global.markserv.url);
    }
  }

  function init () {
    mapModules()
    .then(startServer)
    .then(openBrowser)
    .catch(log.error);
  }

  init();

  module.exports = global.markserv;

})();
