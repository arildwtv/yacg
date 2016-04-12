'use strict';

var path = require('path');
var events = require('events');

var fileWriteUtil = require('./file-write-util');
var util = require('./util');

var flatten = util.flatten;
var startStopWatch = util.startStopWatch;

module.exports.initiate = args => {
    var y = Object.create(new events.EventEmitter(), {
        spec:    { writable: false, configurable: false, value: args.spec    || {} },
        plugins: { writable: false, configurable: false, value: args.plugins || {} },
        options: { writable: false, configurable: false, value: args.options || {} }
    });

    // Collect and add all event subscriptions from plugins
    flatten(y.plugins.map(plugin => plugin.subscriptions && plugin.subscriptions()))
        .map(subscription => subscription && y.addListener(subscription.event, subscription.handler));

    return Promise.resolve(y);
};

module.exports.validateSpec = validator => {
    return y => {
        var stopWatch = startStopWatch();

        y.emit('specValidationStarted');

        return Promise.resolve(validator(y.spec))
            .then(() => {
                y.emit('specValidationCompleted', stopWatch.stop());
                return y;
            })
            .catch(err => {
                y.emit('specValidationFailed', err);
                throw err;
            });
    };
};

module.exports.generateSources = y => {
    y.emit('sourceGenerationStarted');

    var stopWatch = startStopWatch();

    return Promise.all(y.plugins.map(plugin => plugin.generateSources
        ? plugin.generateSources(y.spec, y.options)
        : []))
        .then(sourcesFromPlugins => {
            y.files = flatten(sourcesFromPlugins);
            y.emit('sourceGenerationCompleted', stopWatch.stop());
            return y;
        });
};

module.exports.writeFiles = (outputDir, keepPatterns) => {
    return y => {
        y.emit('sourceOutputStarted');

        var stopWatch = startStopWatch();

        var filesToOutputDir =
            y.files.map(file => fileWriteUtil.prependOutputDirToFilePath(file, outputDir));

        return Promise.all(filesToOutputDir.map(writeDirectoryForFile(y)))
            .then(() => Promise.all(filesToOutputDir.map(writeFile(y, keepPatterns || []))))
            .then(() => {
                y.emit('sourceOutputCompleted', stopWatch.stop());
                return y;
            });
    };
};

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

function writeFile(k, keepPatterns) {
    return file => {
        var keepIfExists = keepPatterns.reduce((doKeep, pattern) => {
            return doKeep || pattern.test(file.path);
        }, false);

        var writeFunction = keepIfExists
            ? fileWriteUtil.writeFileIfNotExists
            : fileWriteUtil.writeFile;

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
