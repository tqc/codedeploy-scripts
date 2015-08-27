"use strict";

class Deployment {
    constructor() {

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

module.exports = {
    Node: require("./node"),
    Nginx: require("./nginx"),
    Deployment: Deployment
};