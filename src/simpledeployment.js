"use strict";


class SimpleDeployment extends require("./deployment") {
    constructor(options) {
        super(options);

        var Node = require("./node");
        var Nginx = require("./nginx");

        this.node = new Node(this.appName, options.nodePort || 5000, options.serverScript || "server.js");
        this.nginx = new Nginx({
            node: this.node,
            domains: options.domains || this.appName,
            useSSL: options.useSSL,
            buildFolder: options.buildFolder,
            staticFolder: options.staticFolder
        });
    }
    BeforeInstall() {
        this.node.stop();
    }
    AfterInstall() {
        this.writeSecretFile(this.appName + "/.env", ".env");
        this.writeSecretFile(this.appName + "/" + this.appName + ".crt", this.appName + ".crt");
        this.writeSecretFile(this.appName + "/" + this.appName + ".key", this.appName + ".key");
        this.nginx.configure();
    }
    ApplicationStart() {
        this.node.start();
        this.nginx.reload();
    }
}

module.exports = SimpleDeployment;
