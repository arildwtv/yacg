var fileUtil = require('./fileUtil');

module.exports = () => {
    return Object.freeze({
        interpolation: Object.freeze({
            interpolateFile: fileUtil.interpolateFile,
            interpolateFileAll: fileUtil.interpolateFileAll,
            interpolateString: fileUtil.interpolateString
        })
    });
};