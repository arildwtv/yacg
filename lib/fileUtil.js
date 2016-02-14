var fs = require('fs');
var mkdirp = require('mkdirp');
var tim = require('tinytim').tim;

module.exports = {
    writeDirectory(dir) {
        return new Promise((resolve, reject) => {
            mkdirp(dir, err => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    },

    writeFile(file) {
        return new Promise((resolve, reject) => {
            fs.writeFile(file.name, file.content, err => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    },

    interpolateFile: interpolate,

    interpolateFileAll(filePath, paramsList) {
        return Promise.all(paramsList.map(params => interpolate(filePath, params)));
    }
};

function interpolate(filePath, params) {
    return readFile(filePath, 'utf8').then(fileContent => {
        return tim(fileContent, params);
    });
}

function readFile(filePath, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, encoding, (err, fileContent) => {
            if (err) {
                return reject(err);
            }

            resolve(fileContent);
        });
    });
}
