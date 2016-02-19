module.exports.flatten = arrays => {
    return arrays.reduce((flat, array) => flat.concat(array), []);
};

module.exports.capitalize = string => {
    return string[0].toUpperCase() + string.substring(1);
};

module.exports.cloneObject = obj => {
    return JSON.parse(JSON.stringify(obj));
};
