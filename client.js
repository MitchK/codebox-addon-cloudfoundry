
define([
    'cloudfoundry'
], function(cloudFoundry) {
    var Q = codebox.require("q");
    var hr = codebox.require("hr/hr");
    var _ = codebox.require("underscore");
    var commands = codebox.require("core/commands/toolbar");
    var settings = codebox.require("core/settings");
    var dialogs = codebox.require("utils/dialogs");
    var rpc = codebox.require("core/backends/rpc");
    var search = codebox.require("core/search");
    var menu = codebox.require("core/commands/menu");
    var user = codebox.require("core/user");
    var panels = codebox.require("core/panels");

    // Add settings page
    settings.add({
        'namespace': "cloudFoundry",
        'title': "Cloud Foundry",
        'defaults': {
            'apiEndpoint': "https://api.run.pivotal.io"
        },
        'fields': {
            'apiEndpoint': {
                'label': "API Endpoint",
                'type': "text",
                'help': "Set your Cloud Foundry instance endpoint",
            },
            'username': {
                'label': "User name ",
                'type': "text",
                'help': "The  user name you use to authenticate against Cloud Foundry",
            },
            'password': {
                'label': "Password",
                'type': "text",
                'help': "The password you use to authenticate against Cloud Foundry",
            },
            'target': {
                'label': "Target",
                'type': "text",
                'help': "Deployment target (org or space),
            },
        }
    });

    // Add apps to search
    search.handler({
        'id': "cloudfoundry",
        'title': "Deploy to CloudFoundry"
    }, function(query) {
        return cloudFoundry.search(query).then(function(apps) {
            return _.map(apps, function(app) {
                return {
                    "text": app.name,
                    "callback": function() {
                        cloudFoundry.deploy(app); 
                    }
                };
            });
        });
    });

    // Add menu
    menu.register("cloudFoundry", {
        title: "Cloud Foundry"
    }).menuSection([
        {
            'type': "action",
            'title': "Settings",
            'action': function() {
                settings.open("cloudFoundry");
            }
        }
    ]).menuSection([
        {
            'type': "action",
            'title': "Refresh Applications",
            'offline': false,
            'action': function() {
                return cloudFoundry.apps(true);
            }
        },
        cloudFoundry.commands
    ]);

    cloudFoundry.apps();
});
