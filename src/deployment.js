"use strict";

var AWS = require("aws-sdk");

class Deployment {
    constructor(options) {
        options = options || {};
        this.appName = options.appName;
        this.secretBucket = options.secretBucket;
    }
    writeSecretFile(key, relPath) {
        if (!this.secretBucket) return;
        var s3 = new AWS.S3();
        var file = require('fs').createWriteStream('/apps/' + this.appName + "/" + relPath);
        s3.getObject({Bucket: this.secretBucket, Key: key}).
            on('httpData', function(chunk) { file.write(chunk); }).
            on('httpDone', function() { file.end(); }).
            send();
    }
    ApplicationStop() {}
    BeforeInstall() {}
    AfterInstall() {}
    ApplicationStart() {}
    ValidateService() {}
    run() {
        var event = process.env.LIFECYCLE_EVENT;
        if (!event) {
            console.log("LIFECYCLE_EVENT is not set");
        }
        else console.log("Handling event " + process.env.LIFECYCLE_EVENT);
        if (process.env.LIFECYCLE_EVENT == "ApplicationStop") this.ApplicationStop();
        else if (process.env.LIFECYCLE_EVENT == "BeforeInstall") this.BeforeInstall();
        else if (process.env.LIFECYCLE_EVENT == "AfterInstall") this.AfterInstall();
        else if (process.env.LIFECYCLE_EVENT == "ApplicationStart") this.ApplicationStart();
        else if (process.env.LIFECYCLE_EVENT == "ValidateService") this.ValidateService();
    }
}

module.exports = Deployment;