module.exports.flatten = arrays => {
    return arrays.reduce((flat, array) => flat.concat(array), []);
};

module.exports.startStopWatch = () => {
    var startTime = new Date().getTime();

    return {
        stop() {
            return new Date().getTime() - startTime;
        }
    };
}