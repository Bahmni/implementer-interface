#!/bin/bash
if [ $1 -eq 0 ]; then
    rm -rf /var/www/implementer_interface
    rm -rf /etc/httpd/conf.d/implementer_interface_ssl.conf
fi
