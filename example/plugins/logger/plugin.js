var directoriesCreated = [];
var filesSkipped = [];
var validationTime;
var sourceGenerationTime;
var sourceOutputTime;

module.exports.subscriptions = () => {
    return [
        {
            event: 'directoryCreated',
            handler(dir) {
                if (directoriesCreated.indexOf(dir) === -1) {
                    directoriesCreated.push(dir);
                }
            }
        },
        {
            event: 'fileCreated',
            handler(file) {
                console.log('File Created:', file.path);
            }
        },
        {
            event: 'fileSkipped',
            handler(file) {
                filesSkipped.push(file.path);
            }
        },
        {
            event: 'specInvalid',
            handler(err) {
                console.log('Specification did not pass validation', err);
            }
        },
        {
            event: 'validationStarted',
            handler(timeInMillis) {
                console.log('Validation started...');
                validationTime = timeInMillis;
            }
        },
        {
            event: 'validationCompleted',
            handler(timeInMillis) {
                console.log('Validation completed...');
                validationTime = timeInMillis;
            }
        },
        {
            event: 'sourceGenerationCompleted',
            handler(timeInMillis) {
                console.log('Sources generated...');
                sourceGenerationTime = timeInMillis;
            }
        },
        {
            event: 'sourceOutputCompleted',
            handler(outputTime) {
                console.log('\nFiles skipped:\n' + (filesSkipped.join('\n') || 'None'));
                validationTime && console.log('\nSpecification validated in', validationTime, 'milliseconds');
                console.log('\nSource generated in', sourceGenerationTime, 'milliseconds');
                console.log('\nSource written to disk in', outputTime, 'milliseconds');
            }
        }
    ];
};
