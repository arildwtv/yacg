var specUtil = require('./specUtil');
var fileUtil = require('./fileUtil');

module.exports = () => {
    return Object.freeze({
        interpolation: Object.freeze({
            interpolateFile: fileUtil.interpolateFile,
            interpolateFileAll: fileUtil.interpolateFileAll,
            interpolateString: fileUtil.interpolateString
        }),
        navigation: Object.freeze({
            getReference: specUtil.getReference
        })
    });
};