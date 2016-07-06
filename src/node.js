"use strict";

var child = require("child_process");

function getPid(port) {
    console.log("getting pid for port " + port);
    try {
        let ns = child.execSync("netstat -lnp", {
            encoding: "utf-8",
            timeout: 500
        });
        var lines = ns.split("\n");
        for (let i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.indexOf(":" + port) < 0) continue;
            var m = line.match(/(\d+)\/node/);
            if (m) return m[1];
        }
    } catch (ex) {
        console.log("Error getting node process");
    }
}

class Node {
    constructor(appName, port, scriptPath) {
        this.appName = appName;
        this.port = port;
        this.scriptPath = scriptPath;
        this.pid = getPid(port);
    }
    start() {
        // start node server
        child.exec("export PORT=" + this.port + "; node /apps/" + this.appName + "/" + this.scriptPath + " > /dev/null 2> /dev/null < /dev/null &", {
            cwd: "/apps/" + this.appName
        });
    }
    stop() {
        if (!this.pid) {
            console.log("No instance found on port " + this.port);
        } else {
            console.log("Killing process " + this.pid + " listening on port " + this.port);
            child.execSync("kill " + this.pid);
        }
    }
}

module.exports = Node;
