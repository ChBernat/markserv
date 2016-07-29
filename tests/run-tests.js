var markserv = require('../markserv.js');
var Promise = require('bluebird');

// console.log(markserv);

// The Markserv settings file should contain a map & processors definitions
exports.testMarkservSettings = function (test) {
    test.expect(2);
    test.ok(typeof markserv.settings.map === 'object', " assertion should pass");
    test.ok(typeof markserv.settings.processors === 'object', " assertion should pass");
    test.done();
};

