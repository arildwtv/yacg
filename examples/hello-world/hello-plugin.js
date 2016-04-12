module.exports.subscriptions = function () {
    return [
        {
            event: 'sourceGenerationCompleted',
            handler: function (millis) {
                console.log('Example source generated in', millis, 'milliseconds');
            }
        }
    ];
};

module.exports.generateSources = function (spec) {
    return [
        {
            path: 'hello.txt',
            content: 'Hello, ' + spec.name + '!'
        },
        {
            path: 'hello-reversed.txt',
            content: 'Hello, ' + spec.name.split('').reverse().join('') + '!'
        }
    ];
};