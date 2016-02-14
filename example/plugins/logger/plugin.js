module.exports.subscriptions = () => {
    return [
        {
            event: 'directoryCreated',
            handler(dir) {
                console.log('Directory created:', dir);
            }
        },
        {
            event: 'fileCreated',
            handler(file) {
                console.log('File created:', file.name);
            }
        },
        {
            event: 'specInvalid',
            handler(err) {
                console.log('Specification did not pass validation', err);
            }
        }
    ];
};
