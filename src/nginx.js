"use strict";

var child = require("child_process");
var fs = require("fs");


class Nginx {
    constructor(node, domains) {
        this.node = node;
        this.appName = node.appName;
        this.domains = domains;
        this.nodePort = node.port;
    }
    configure(options) {

        var confpath = "/etc/nginx/conf.d/" + this.appName + ".conf";

        var conf = fs.readFileSync(__dirname + "/nginx-app.conf", "utf-8")
        .replace(/__APPNAME__/ig, this.appName)
        .replace(/__DOMAINS__/ig, this.domains)
        .replace(/__NODEPORT__/ig, this.nodePort);

        fs.writeFileSync(confpath, conf);

    }
    reload() {
        child.spawn("/etc/init.d/nginx", ["reload"], {});
    }
}

module.exports = Nginx;
