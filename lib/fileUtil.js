var fs = require('fs');
var mkdirp = require('mkdirp');
var tim = require('tinytim').tim;

module.exports.writeDirectory = dir => {
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
};

module.exports.writeFile = file => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file.path, file.content, err => {
            if (err) {
                return reject(err);
            }

            resolve(true);
        });
    });
};

module.exports.writeFileIfNotExists = file => {
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
};

module.exports.readFile = (filePath, encoding) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, encoding, (err, fileContent) => {
            if (err) {
                return reject(err);
            }

            resolve(fileContent);
        });
    });
};


module.exports.interpolateFile = (filePath, params) => {
    return module.exports.readFile(filePath, 'utf8').then(fileContent => {
        return tim(fileContent, params);
    });
};

module.exports.interpolateFileAll = (filePath, paramsList) => {
    return module.exports.readFile(filePath, 'utf8').then(fileContent => {
        return paramsList.map(params => tim(fileContent, params));
    });
};

module.exports.prependOutputDirToFilePath = (file, outputDir) => {
    return {
        path: outputDir + '/' + file.path,
        content: file.content
    };
};