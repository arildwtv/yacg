var kodify = require('../index').kodify;

var spec = require('./spec.json');

var outputDir = process.argv[2] || '.';

// List plugins for generating code.
var plugins = [
    require('./plugins/rest/plugin'),
    require('./plugins/logger/plugin')
];

// Define options.
var options = {
    package: 'no.example.app'
};

// Define validator function.
//var validator = spec => require('swagger-parser').validate(spec);

// Decide which files to keep if they already exist.
var keepPatterns = [
//    /Delegate\.java$/,
//    /Service\.java$/,
//    /(?!Health)RestService/,
//    /App\.java$/,
//    /JerseyConfig.java$/,
//    /HealthConfig.java$/
];

// Run kodify.
kodify({ spec, plugins, options })
//    .then(k => k.validateSpec(validator))
    .then(k => k.generateSources())
    .then(k => k.writeFiles(outputDir, keepPatterns))
    .catch(err => console.error('Something went wrong during code generation', err, err.stack));
