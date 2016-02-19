var specUtil = require('./specUtil');
var fileUtil = require('./fileUtil');

module.exports = () => {
    return Object.freeze({
        interpolation: Object.freeze({
            interpolateFile: fileUtil.interpolateFile,
            interpolateFileAll: fileUtil.interpolateFileAll
        }),
        navigation: Object.freeze({
            getReference: specUtil.getReference
        })
    });
};