#!/usr/bin/env node

(function (){

  'use strict';

  var Promise = require('bluebird');
  var fs        = require('fs');
  var flags = require('commander');
  var pkg = require('./package.json');
  var path = require('path');

  var logger = require('./core/logger.js');

  // Serve Github Flavor setings be default
  var defaultSettingsFile = __dirname + '/biscuits/github/settings.js';

  // Options

  flags.version(pkg.version)
    .option('--settings [type]', 'Path to settings.json file', defaultSettingsFile)

    .option('-d, --dir [type]', 'Serve from directory [dir]', './')
    // .option('-w, --domain [type]', 'https://www.your-domain.com.', null)
    .option('-a, --address [type]', 'Serve on ip/address [address]', 'localhost')
    .option('-p, --port [type]', 'Serve on port [port]', '8080')
    .option('-l, --livereloadport [type]', 'LiveReload port [port]', '35729')
    // .option('-b, --blog [type]', 'Blog settings file .json file', null)
    // .option('-h, --header [type]', 'Header .md file', null)
    // .option('-f, --footer [type]', 'Footer .md file', null)
    // .option('-n, --navigation [type]', 'Navigation .md file', null)
    // // .option('-s, --less [type]', 'Path to Less styles [less]', GitHubStyle)
    // .option('-f, --file [type]', 'Open specific file in browser [file]')
    .option('-x, --x', 'Don\'t open browser on run.')
    // .option('-e, --exporthtml', 'Export to static Html.')
    // .option('-v, --verbose', 'verbose output')
    .parse(process.argv);

  global.flags = flags;


  // Load Core Markserv Modules
  var settings = require(flags.settings);

  // Modules will be loaded relative to the settings file
  var settingsPath = path.dirname(flags.settings);
  global.settingsPath = settingsPath;
  global.dir = flags.dir;


  // var relativeDirToBiscuitPath = path.dirname(path.relative(flags.dir, flags.settings));


  var MarkservInstance = {
    pid: process.pid,
    path: {
      root: flags.dir,
      // biscuit: relativeDirToBiscuitPath,
      biscuit: path.dirname(flags.settings),
      // markserv: __dirname,
    },
    // page: {
    //   css:
    // }
  };


  // Compile HTML with nested includes
  var htmlParser = require('./core/htmlParser/htmlParser.js').parse;



  function requireModule (mapName) {
    return new Promise(function (resolve, reject) {
      var modulePath = mapName.module;
      var activeModule = require(settingsPath + '/' + modulePath);
      resolve(activeModule);
    });
  }


  function compileTemplate (mapName) {
    return new Promise(function (resolve, reject) {

      if (mapName.hasOwnProperty('template')) {
        var templateFilepath = settingsPath + '/' + mapName.template;

        resolve(htmlParser(templateFilepath));
      }

      else {
        resolve('compileTemplate: no template');
      }

    });
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
      .catch(logger.error);

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
            logger.trace('Loaded module: ' + moduleName);
            deferred.resolve(loadedModule);
          }, function (reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        };
      }


      for (var moduleName in settings.map) {
        promiseStack.push(newPromise(moduleName));
      }

      var fire = function () {
        if (promiseStack.length) {
          promiseStack.shift()()
            .then(function () {
              return fire();
            });
         } else {
           resolve(map);
         }
      };

      return fire();
    });
  }


  function startServer (moduleMap) {
    // console.log(map);

    var requestHandler = require('./core/requestHandler.js');
    requestHandler.setContext(MarkservInstance);
    requestHandler.mapModules(moduleMap);

    var server = require('./core/server.js');

    // Begin the server
    server.start(requestHandler);
  }


  function init () {
    mapModules()
    .then(startServer)
    .catch(logger.error);
  }


  init();

})();
