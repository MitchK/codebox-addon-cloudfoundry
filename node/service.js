// Requires
var config = require('./config');
var Q = require('q');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var spawn = require('child_process').spawn;

function CloudFoundryRPCService(workspace, logger, shells) {
    this.workspace = workspace;
    this.logger = logger;
    this.shells = shells;

    _.bindAll(this);
}

// Get cf client
CloudFoundryRPCService.prototype._client = function(user) {
    
    var cfSettings = user.settings[config.namespace];
    
    // Check if the user has correctly set up the client
    if (!cfSettings) {
        return Q.reject(new Error("user.settings[" + config.namespace + "] not defined."));
    }
    if (!cfSettings.apiEndpoint) {
        return Q.reject(new Error("Cloud Foundry API endpoint not set"));
    }
    if (!cfSettings.email) {
        return Q.reject(new Error("Cloud Foundry user email not set"));
    }
    if (!cfSettings.org) {
        return Q.reject(new Error("Cloud Foundry user org not set"));
    }
    if (!cfSettings.password) {
        return Q.reject(new Error("Cloud Foundry user password not set"));
    }
    
    var client = {}; // TODO
    return Q(client)
};

// List user applications
CloudFoundryRPCService.prototype.apps = function(args, meta) {
    return this._client(meta.user).then(function(client) {
        return client.apps().list();
    }).then(function(apps) {
        return Q(apps);
    });
};

// Deploy an application
HerokuRPCService.prototype.deploy = function(args, meta) {
    var git, that = this;
    if (!args.app) {
        return Q.reject(new Error("Need 'app' to deploy to Cloud Foundry"));
    }

    this.logger.log("Start deploying to CloudFoundry ("+args.app+")");

    // Spawn the new shell
    var shellId = config.namespace + "-deploy";
    var shell = this.shells.createShellCommand(shellId, ['cf', 'push', args.app]);

    return Q({
        shellId: shellId
    });
};

// Exports
exports.HerokuRPCService = HerokuRPCService;
