FROM httpd:2.4.57-alpine

ADD dist/implementer_interface.zip /etc/implementer-interface/
RUN unzip -d /usr/local/apache2/htdocs/implementer-interface /etc/implementer-interface/implementer_interface.zip
RUN rm -r /etc/implementer-interface
