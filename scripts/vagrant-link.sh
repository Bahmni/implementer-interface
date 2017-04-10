#!/bin/sh -x -e

PATH_OF_CURRENT_SCRIPT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $PATH_OF_CURRENT_SCRIPT/vagrant_functions.sh
#USER=jss
USER=bahmni

run_in_vagrant -c "sudo rm -rf implementer_interface"
run_in_vagrant -c "sudo ln -s /bahmni/implementer-interface/dist/ /var/www/implementer_interface"
run_in_vagrant -c "sudo chown -h ${USER}:${USER} /var/www/implementer_interface"
