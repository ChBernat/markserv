#!/usr/bin/env node

(function (){

  'use strict';

  var log = require('./core/log.js');
  var pkg = require('./package.json');
  var Promise = require('bluebird');
  var commander = require('commander');
  var path = require('path');

  // Serve Github Flavor setings be default
  var defaultSettings = __dirname + '/biscuits/github/settings.js';

  commander.version(pkg.version)
    .option('--settings [type]', 'Path to settings.json file', defaultSettings)
    .option('-d, --dir [type]', 'Serve from directory [dir]', './')
    .option('-a, --address [type]', 'Serve on ip/address [address]', 'localhost')
    .option('-p, --port [type]', 'Serve on port [port]', '8080')
    .option('-r, --livereloadport [type]', 'LiveReload port [port]', '35729')
    .option('-z, --z', 'Do not open the browser.')
    .option('-x, --exporthtml', 'Export static HTML files.')
    .option('-l, --loglevel', '0')
    .parse(process.argv);

  var flags = commander;
  var settingsPath = path.dirname(flags.settings);
  var settings = require(flags.settings);

  // It is intentional that I serve the settings on a global namespace.
  // I do this for maintainability purposes, I do not consider it fit
  // to pass variables through many levels of a promise tree. If there
  // is a better way to do this, let me know.

  // "markserv"  is the *only* global namespace that should be used.
  global.markserv = {
    flags: flags,
    pid: process.pid,
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
      .catch(log.error);

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
          // console.log(moduleName);

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
            })
         } else {
           resolve(map);
         }
      };

      return fire();
    });
  }


  function startServer (moduleMap) {
    // console.log(map);

    var requestHandler = require('./core/httpServer/requestHandler.js');
    requestHandler.setContext(global.markserv);
    requestHandler.mapModules(moduleMap);

    var server = require('./core/httpServer/server.js');

    // Begin the server
    server.start(requestHandler);
  }


  function init () {
    mapModules()
    .then(startServer)
    .catch(log.error);
  }


  init();

})();
