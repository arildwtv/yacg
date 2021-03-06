// Run from node.

// Require the YACG module.
var yacg = require('../../index');

// Determine where the files should be written.
var outputDir = './hello/text-files';

// Register the YACG input.
var spec = { name: 'YACG Fan' };

// The plugin(s) registered with YACG.
var plugins = [
    require('./hello-plugin')
];

// Require our hello world validator.
var helloValidator = require('./hello-validator');

yacg.initialize(spec, plugins)
    // Validate the specification.
    .then(yacg.validateSpec(helloValidator))

    // Let our hello plugin generate our sources.
    .then(yacg.generateSources)

    // Output the sources to files.
    .then(yacg.writeFiles(outputDir))

    // Catch if any error is thrown during the process.
    .catch(err => console.error('Something went wrong with the generation:', err));