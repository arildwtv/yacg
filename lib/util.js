module.exports.flatten = arrays => {
    return arrays.reduce((flat, array) => flat.concat(array), []);
};

module.exports.cloneObject = obj => {
    return JSON.parse(JSON.stringify(obj));
};
