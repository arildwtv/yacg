module.exports.flatMap = arrays => {
    return arrays.reduce((flat, array) => flat.concat(array), []);
};

module.exports.capitalize = string => {
    return string[0].toUpperCase() + string.substring(1);
};
