var async = require('asyncawait/async');
var await = require('asyncawait/await');

var path = require('path');

var util = require('./util');
var fileUtil = require('./fileUtil');
var specUtil = require('./specUtil');

var events = require('events');

var flatMap = util.flatMap;

module.exports.kodify = async(args => {
    'use strict';

    var outputDir   = args.outputDir;
    var spec        = args.spec;
    var plugins     = args.plugins || [];
    var options     = args.options || {};

    var eventEmitter = new events.EventEmitter();
    var k = Object.create(eventEmitter);

    // Collect and add all event subscriptions from plugins
    flatMap(plugins.map(plugin => plugin.subscriptions && plugin.subscriptions()))
        .map(subscription => subscription && k.addListener(subscription.event, subscription.handler));

    k.validateSpec = async((validator) => {
        return validator(spec)
            .then(() => k)
            .catch(err => {
                k.emit('specInvalid', err);
                throw err;
            });
    });

    k.createFiles = async(() => {
        var helper = Object.freeze({
            interpolation: Object.freeze({
                interpolateFile: fileUtil.interpolateFile,
                interpolateFileAll: fileUtil.interpolateFileAll
            }),
            navigation: Object.freeze({
                getReference: specUtil.getReference
            })
        });

        // Trigger creation of files
        var filesFromPlugins = await(plugins.map(plugin => plugin.createFiles
            ? plugin.createFiles(cloneObject(spec), cloneObject(options), helper)
            : []));

        k.files = flatMap(filesFromPlugins).map(prependOutputDirToFileName(outputDir));

        return k;
    });

    k.writeFiles = async(() => {
        return Promise.all(k.files.map(writeDirectoryForFile(k)))
            .then(() => Promise.all(k.files.map(writeFile(k))))
            .catch(err => console.log(err.stack));
    });

    return Promise.resolve(k);
    /*

    Promise.all(fileCreationPromises)
        .then(flatMap)
        .then(files => files.map(prependOutputDirToFileName(outputDir)))
        .then(files => {

        });
*/
});

function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function prependOutputDirToFileName(outputDir) {
    return file => {
        return {
            name: outputDir + '/' + file.name,
            content: file.content
        };
    };
}

function createFiles(k, files) {
}

function writeDirectoryForFile(k) {
    return file => {
        var dir = path.dirname(file.name);
        return fileUtil.writeDirectory(dir)
            .then(p => {
                k.emit('directoryCreated', dir);
                return p;
            });
    };
}

function writeFile(k) {
    return file => {
        return fileUtil.writeFile(file)
            .then(p => {
                k.emit('fileCreated', file);
                return p;
            });
    };
}
