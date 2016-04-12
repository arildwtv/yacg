module.exports = function (spec) {
    if (typeof spec !== 'object' || typeof spec.name !== 'string') {
        throw 'Invalid spec format!';
    }
};
