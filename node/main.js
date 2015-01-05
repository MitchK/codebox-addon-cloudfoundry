
var config = require('./config');
var CloudFoundryRPCService = require('./service').CloudFoundryRPCService;

module.exports = function (options, imports, register) {
    // Import
    var httpRPC = imports.httpRPC;
    var workspace = imports.workspace;
    var logger = imports.logger.namespace(config.namespace);
    var shells = imports.shells;

    var service = new CloudFoundryRPCService(workspace, logger, shells);

    // Register RPC
    httpRPC.register('/' + config.namespace, service);

    // Register
    register(null, {});
};
