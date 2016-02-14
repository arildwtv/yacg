var path = require('path');
var kodify = require('../index').kodify;
var spec = require('./spec.json');

var outputDir = process.argv[2] || '.';

var plugins = [
    require('./plugins/rest/plugin'),
    require('./plugins/logger/plugin')
];

var options = {
    package: 'no.example.app'
};

// var validator = spec => require('swagger-parser').validate(spec);

kodify({ outputDir, spec, plugins, options })
    //.then(k => k.validateSpec(validator))
    .then(k => k.createFiles())
    .then(k => k.writeFiles());
