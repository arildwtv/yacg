var capitalize = require('../../../lib/util').capitalize;

module.exports.createFiles = (spec, options, helper) => {

    // Map each path to a service (based on first path segment).
    var serviceMap = mapPathsToService(spec.paths);

    var serviceNames = Object.keys(serviceMap);

    var params = serviceNames.map(serviceName => {
        return {
            serviceNameCapitalized: capitalize(serviceName),
            serviceNameLowerCase: serviceName.toLowerCase(),
            servicePath: serviceName,
            package: options.package,
            methods: ''
        };
    });

    var interpolatedFile =
        helper.interpolation.interpolateFileAll(__dirname + '/tpl/RestController.tpl', params);

    return interpolatedFile.then(contents => {
        return contents.map((content, index) => {
            var serviceName = serviceNames[index];
            var path = options.package.replace(/\./g, '/') + '/' + serviceName.toLowerCase();
            return {
                name: path + '/' + capitalize(serviceName) + 'RestController.java',
                content: content
            };
        });
    });
};

function mapPathsToService(paths) {
    return Object.keys(paths).reduce((serviceMap, path) => {
        var serviceName = path.split(/\//)[1];

        if (typeof serviceMap[serviceName] === 'undefined') {
            serviceMap[serviceName] = [];
        }

        serviceMap[serviceName].push({ path: path, declaration: paths[path] });

        return serviceMap;
    }, {});
}
