module.exports.getReference = (spec, ref) => {
    var propPath = ref.split(/\//);
    propPath.shift();

    return getObjectProperty(spec, propPath);
};

function getObjectProperty(val, propPath) {
    if (propPath.length === 0) {
        return val;
    }

    if (typeof val === 'object') {
        var prop = propPath.shift();
        return getObjectProperty(val[prop], propPath);
    }

    return undefined;
}
