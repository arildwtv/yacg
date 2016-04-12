var path = require('path');

var fileWriteUtil = require('./file-write-util');
var flatten = require('./util').flatten;
var cloneObject = require('./util').cloneObject;
var events = require('events');

module.exports.yacg = args => {
    'use strict';

    var spec        = args.spec || {};
    var plugins     = args.plugins || [];
    var options     = args.options || {};

    var eventEmitter = new events.EventEmitter();
    var y = Object.create(eventEmitter);

    // Collect and add all event subscriptions from plugins
    flatten(plugins.map(plugin => plugin.subscriptions && plugin.subscriptions()))
        .map(subscription => subscription && y.addListener(subscription.event, subscription.handler));

    y.validateSpec = validator => {
        var stopWatch = startStopWatch();

        y.emit('specValidationStarted');

        return Promise.resolve(validator(cloneObject(spec)))
            .then(() => {
                y.emit('specValidationCompleted', stopWatch.stop());
                return y;
            })
            .catch(err => {
                y.emit('specValidationFailed', err);
                throw err;
            });
    };

    y.generateSources = () => {
        y.emit('sourceGenerationStarted');

        var stopWatch = startStopWatch();

        return Promise.all(plugins.map(plugin => plugin.generateSources
            ? plugin.generateSources(cloneObject(spec), cloneObject(options))
            : []))
            .then(sourcesFromPlugins => {
                y.files = flatten(sourcesFromPlugins);
                y.emit('sourceGenerationCompleted', stopWatch.stop());
                return y;
            });
    };

    y.writeFiles = (outputDir, keepPatterns) => {
        y.emit('sourceOutputStarted');

        var stopWatch = startStopWatch();

        var files = y.files.map(file => fileWriteUtil.prependOutputDirToFilePath(file, outputDir));

        writeFiles(files, y, keepPatterns || [])
            .then(() => {
                y.emit('sourceOutputCompleted', stopWatch.stop());
                return y;
            });
    };

    return Promise.resolve(y);
};

function writeFiles(files, k, keepPatterns) {
    return Promise.all(files.map(writeDirectoryForFile(k)))
        .then(() => Promise.all(files.map(writeFile(k, keepPatterns))));
}

function writeDirectoryForFile(k) {
    return file => {
        var dir = path.dirname(file.path);
        return fileWriteUtil.writeDirectory(dir)
            .then(directoryCreated => {
                if (directoryCreated) {
                    k.emit('directoryCreated', dir);
                }

                return directoryCreated;
            });
    };
}

function startStopWatch() {
    var startTime = new Date().getTime();

    return {
        stop() {
            return new Date().getTime() - startTime;
        }
    };
}

function writeFile(k, keepPatterns) {
    return file => {
        var keepIfExists = keepPatterns.reduce((doKeep, pattern) => {
            return doKeep || pattern.test(file.path);
        }, false);

        var writeFunction = keepIfExists ? fileWriteUtil.writeFileIfNotExists : fileWriteUtil.writeFile;

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
