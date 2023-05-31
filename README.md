Implementer Interface
---------------------

### File naming conventions

1. All components should be in Pascal Case (camel case starting with uppercase letter)
2. Other files including styles should be in Camel Case starting with lowercase letter
3. Test files should have the same name as the file followed by .spec.js

## Setup Steps

1. Install nvm
2. Install node-v12: `nvm install 12`
3. Switch to node 12 : `nvm use 12`
4. Install dependencies, `yarn install`
5. Build implementer-interface - `yarn run build`
6. Build on every change - `yarn build --watch`
### Setup using Bahmni on Vagrant:
1. Ensure that Bahmni is running in the vagrant box and is accessible on ip 192.168.33.10.
2. Start the webserver using `yarn start`. You can configure the same in [intellij](http://picpaste.com/Screen_Shot_2016-10-30_at_7.04.02_PM-riCem4le.png) as well
3. Update the `/etc/httpd/conf/httpd.conf` file in vagrant box.  Add these under the `AddOutputFilterByType DEFLATE text/javascript`
`
Header set Access-Control-Allow-Origin "http://localhost:8080"`
`Header set Access-Control-Allow-Methods "*"`
`Header set Access-Control-Allow-Credentials "true"`
4. Restart the httpd service
`
service httpd restart
`
5. Access server at http://localhost:8080

### Setup using Bahmni on Docker:

In order to setup developement environment for implementer-interface by running Bahmni on Docker, run the build in watch mode and follow the instructions mentioned [here](https://github.com/Bahmni/bahmni-package/blob/master/bahmni-docker/README.md#development-setup-for-implementer-interface)

### SNOMED Integration Support

Implementer-interface also helps implementers and administrators to create custom forms that leverages SNOMED terminologies using the Forms 2.0 framework in Bahmni. More details can be found in [this](https://bahmni.atlassian.net/wiki/spaces/BAH/pages/3132686337/SNOMED+FHIR+Terminology+Server+Integration+with+Bahmni) Wiki link
