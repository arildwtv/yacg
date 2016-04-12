var capitalize = require('../../../lib/util').capitalize;

module.exports.generateSources = (spec, options, helper) => {

    var interpolateFileAll = helper.interpolation.interpolateFileAll;

    // Map each path to a service (based on first path segment).
    var serviceMap = mapPathsToService(spec.paths);

    // Keep a list of service names.
    var serviceNames = Object.keys(serviceMap);

    // Map each service to a template parameter hash.
    var paramsList = mapServicesToTemplateParams(serviceNames, options);

    // Generate a rest controller per service, interpolating parameters.
    return interpolateFileAll(__dirname + '/tpl/RestService.tpl', paramsList)
        .then(restControllerSources => {
            // Map rest controller sources to source definitions.
            return restControllerSources.map((content, index) => {
                var serviceName = serviceNames[index];
                var path = options.package.replace(/\./g, '/') + '/' + serviceName.toLowerCase();

                return {
                    path: path + '/' + capitalize(serviceName) + 'RestService.java',
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

function mapServicesToTemplateParams(serviceNames, options) {
    return serviceNames.map(serviceName => {
        return {
            serviceNameCapitalized: capitalize(serviceName),
            serviceNameLowerCase: serviceName.toLowerCase(),
            servicePath: serviceName,
            package: options.package,
            methods: ''
        };
    });
}