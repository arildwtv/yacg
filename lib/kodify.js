var async = require('asyncawait/async');
var await = require('asyncawait/await');

var path = require('path');

var helper = require('./helper')();
var fileUtil = require('./fileUtil');
var flatten = require('./util').flatten;
var cloneObject = require('./util').cloneObject;
var events = require('events');

module.exports.kodify = async (args => {
    'use strict';

    var spec        = args.spec;
    var plugins     = args.plugins || [];
    var options     = args.options || {};

    var eventEmitter = new events.EventEmitter();
    var k = Object.create(eventEmitter);

    // Collect and add all event subscriptions from plugins
    flatten(plugins.map(plugin => plugin.subscriptions && plugin.subscriptions()))
        .map(subscription => subscription && k.addListener(subscription.event, subscription.handler));

    k.validateSpec = async (validator => {
        try {
            await (validator(spec));
        } catch (err) {
            k.emit('specInvalid', err);
            console.log('k.emit', k.emit);
            throw err;
        }

        return k;
    });

    k.generateSources = async (() => {
        var sourcesFromPlugins = await (plugins.map(plugin => plugin.generateSources
            ? plugin.generateSources(cloneObject(spec), cloneObject(options), helper)
            : []));

        k.files = flatten(sourcesFromPlugins);

        return k;
    });

    k.writeFiles = async (((outputDir, keepPatterns) => {

        var files = k.files.map(file => fileUtil.prependOutputDirToFilePath(file, outputDir));

        await (writeFiles(files, k, keepPatterns));

        return k;
    }));

    return Promise.resolve(k);
});

function writeFiles(files, k, keepPatterns) {
    return Promise.all(files.map(writeDirectoryForFile(k)))
        .then(() => Promise.all(files.map(writeFile(k, keepPatterns))));
}

function writeDirectoryForFile(k) {
    return file => {
        var dir = path.dirname(file.path);
        return fileUtil.writeDirectory(dir)
            .then(directoryCreated => {
                if (directoryCreated) {
                    k.emit('directoryCreated', dir);
                }

                return directoryCreated;
            });
    };
}

function writeFile(k, keepPatterns) {
    return file => {
        var keepIfExists = keepPatterns.reduce((doKeep, pattern) => {
            return doKeep || pattern.test(file.path);
        }, false);

        var writeFunction = keepIfExists ? fileUtil.writeFileIfNotExists : fileUtil.writeFile;

        return writeFunction(file)
            .then(p => {
                if (p === true) {
                    k.emit('fileCreated', file);
                } else {
                    k.emit('fileSkipped', file);
                }
                return p;
            });
    };
}
