"use strict";

class NodeDeployment extends require("./deployment") {
    constructor(options) {
        super(options);

        var Node = require("./node");

        this.node = new Node(this.appName, options.nodePort || 5000, options.serverScript || "server.js");
    }
    BeforeInstall() {
        this.node.stop();
    }
    AfterInstall() {
        this.writeSecretFile(this.appName + "/.env", ".env");
    }
    ApplicationStart() {
        this.node.start();
    }
}

module.exports = NodeDeployment;
