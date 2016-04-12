var fs = require('fs');
var mkdirp = require('mkdirp');

function writeDirectory(dir) {
    return new Promise((resolve, reject) => {
        fs.stat(dir, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return mkdirp(dir, err => {
                        if (err) {
                            return reject(err);
                        }

                        resolve(true);
                    });
                }
            }

            if (stats.isDirectory()) {
                return resolve(false);
            }

            if (stats.isFile()) {
                throw new Error('Attempted to create directory ' + dir + ', but it is actually a file');
            }
        });
    });
}

function writeFile(file) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file.path, file.content, err => {
            if (err) {
                return reject(err);
            }

            resolve(true);
        });
    });
}

function writeFileIfNotExists(file) {
    return new Promise((resolve, reject) => {
        fs.stat(file.path, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return module.exports.writeFile(file)
                        .then(p => resolve(true))
                        .catch(reject);
                }
            }

            resolve(false);
        });
    });
}

function prependOutputDirToFilePath(file, outputDir) {
    return {
        path: outputDir + '/' + file.path,
        content: file.content
    };
}

module.exports.writeDirectory = writeDirectory;
module.exports.writeFile = writeFile;
module.exports.writeFileIfNotExists = writeFileIfNotExists;
module.exports.prependOutputDirToFilePath = prependOutputDirToFilePath;
