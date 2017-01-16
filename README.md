Implementer Interface
---------------------

### File naming conventions

1. All components should be in Pascal Case (camel case starting with uppercase letter)
2. Other files including styles should be in Camel Case starting with lowercase letter
3. Test files should have the same name as the file followed by .spec.js

### Setup Steps

1. Install nvm
2. Install node
3. Install dependencies, `yarn`
4. Ensure that Bahmni is running in the vagrant box and is accessible on ip 192.168.33.10.
5. Build implementer-interface - `yarn run build`
6. Start the webserver using `yarn start`. You can configure the same in [intellij](http://picpaste.com/Screen_Shot_2016-10-30_at_7.04.02_PM-riCem4le.png) as well
7. Update the `/etc/httpd/conf/httpd.conf` file in vagrant box.  Add these under the `AddOutputFilterByType DEFLATE text/javascript`
`
Header set Access-Control-Allow-Origin "http://localhost:8080"`
`Header set Access-Control-Allow-Methods "*"`
`Header set Access-Control-Allow-Credentials "true"`
8. Restart the httpd service
`
service httpd restart
`
9. Access server at http://localhost:8080
