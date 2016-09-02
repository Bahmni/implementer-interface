#!/bin/bash

if [ -f /etc/bahmni-installer/bahmni.conf ]; then
. /etc/bahmni-installer/bahmni.conf
fi

#create bahmni user and group if doesn't exist
USERID=bahmni
GROUPID=bahmni
/bin/id -g $GROUPID 2>/dev/null
[ $? -eq 1 ]
groupadd bahmni

/bin/id $USERID 2>/dev/null
[ $? -eq 1 ]
useradd -g bahmni bahmni


setupApps(){
    ln -s /opt/bahmni-implementer-interface/etc/implementer_interface/ /var/www/implementer_interface
}

setupConfFiles() {
    cp -f /opt/bahmni-implementer-interface/etc/implementer_interface_ssl.conf /etc/httpd/conf.d/implementer_interface_ssl.conf
}

manage_permissions(){
    # permissions
    chown -R bahmni:bahmni /opt/bahmni-implementer-interface
    chown -R bahmni:bahmni /var/www/implementer_interface
    chown -R bahmni:bahmni /etc/httpd/conf.d/implementer_interface_ssl.conf
}

setupApps
setupConfFiles
manage_permissions

service httpd reload || true
