"use strict";

var child = require("child_process");
var fs = require("fs");


class Nginx {
    constructor(options) {
        var node = options.node;
        this.appName = node.appName;
        this.domains = options.domains;
        this.nodePort = node.port;
        this.buildFolder = options.buildFolder || "build/prod/web";
        this.staticFolder = options.buildFolder || "static";
        this.useSSL = options.useSSL;
    }
    configure() {
        var templatePath = __dirname + "/nginx-app.conf";
        if (this.useSSL) templatePath = __dirname + "/nginx-app-secure.conf";

        var confpath = "/etc/nginx/conf.d/" + this.appName + ".conf";

        var conf = fs.readFileSync(templatePath, "utf-8")
        .replace(/__APPNAME__/ig, this.appName)
        .replace(/__DOMAINS__/ig, this.domains)
        .replace(/__BUILDFOLDER__/ig, this.buildFolder)
        .replace(/__STATICFOLDER__/ig, this.staticFolder)
        .replace(/__NODEPORT__/ig, this.nodePort);

        fs.writeFileSync(confpath, conf);

    }
    reload() {
        child.spawn("/etc/init.d/nginx", ["reload"], {});
    }
}

module.exports = Nginx;
