FROM httpd:2.4-alpine

ADD dist/implementer_interface.zip /etc/implementer_interface/
RUN unzip -d /usr/local/apache2/htdocs/implementer_interface /etc/implementer_interface/implementer_interface.zip
RUN rm -r /etc/implementer_interface
