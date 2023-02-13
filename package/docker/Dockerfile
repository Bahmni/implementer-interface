FROM amazoncorretto:8

RUN yum -y install unzip
ADD dist/implementer_interface.zip /etc/implementer-interface/
RUN unzip -d /usr/local/apache2/htdocs/implementer-interface /etc/implementer-interface/implementer_interface.zip
RUN rm -r /etc/implementer-interface
