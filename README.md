# CodeDeploy Scripts

[ ![Codeship Status for tqc/codedeploy-scripts](https://codeship.com/projects/909dab90-2e9f-0133-1da1-6a18900ed8b9/status?branch=master)](https://codeship.com/projects/99161)

AWS CodeDeploy lifecycle scripts using ES6 to deploy a node app to EC2.

See https://github.com/tqc/react-demo for a minimal working example.

## Usage

    npm install codedeploy-scripts

In the app folder, you only need two simple files to handle the deployment.

###appspec.yml

This tells CodeDeploy to copy everything to /apps/appname and run deployment.js for all lifecycle events. ApplicationStop is omitted, but you can use it if you are extremely confident in the quality of your code, or just enjoy manually fixing broken servers.

    version: 0.0
    os: linux
    files:
        - source: /
          destination: /apps/appname
    hooks:
    #  ApplicationStop:
    #    - location: deployment.js
    #      timeout: 180
      BeforeInstall:
        - location: deployment.js
          timeout: 180
      AfterInstall:
        - location: deployment.js
          timeout: 180
      ApplicationStart:
        - location: deployment.js
          timeout: 180
      ValidateService:
        - location: deployment.js
          timeout: 180


### deployment.js 

Extends the deployment class with any custom actions needed on CodeDeploy lifecycle events. Deployment.run() will call the appropriate method based on the LIFECYCLE_EVENT variable set by CodeDeploy.

The below code will run /apps/deploytest/server.js on port 5000, with nginx as a reverse proxy and serving static files on deploytest.example.com:80

    #!/usr/bin/env node
    
    var SimpleDeployment = require("codedeploy-scripts").SimpleDeployment;
    var deployment = new SimpleDeployment({
        appName: "deploytest",
        nodePort: "5000",
        serverScript: "server.js",
        domains: "deploytest.example.com",
        // files in these folders will be served from nginx without calling the node server
        buildFolder: "build",
        staticFolder: "static",        
        // files in s3 my-secret-bucket/deploytest will be copied to /apps/deploytest; suitable for ssh keys and
        // config files which can't be part of the code deployment
        secretBucket: "my-secret-bucket",
        // if true, nginx will be set to serve https using /apps/deploytest/deploytest.[crt|key]
        useSSL: false
    });
    deployment.run();

For more complex scenarios, just create a custom subclass based on the implementation of SimpleDeployment.

## Assumptions

To keep things simple, the code makes a few assumptions.

* The target is a standard Amazon Linux instance
* node.js is installed
* The app will be installed to /apps/appname

A userdata script that will sufficiently configure a standard Amazon Linux instance can be found at https://github.com/tqc/ec2scripts/blob/master/userdata-app.sh

Manual configuration is required for the security settings - the machine role will need the standard CodeDeploy access settings, plus access to the secrets bucket if used.
