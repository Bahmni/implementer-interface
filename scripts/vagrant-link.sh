# This Source Code Form is subject to the terms of the Mozilla Public License,
# v. 2.0. If a copy of the MPL was not distributed with this file, You can
# obtain one at https://www.bahmni.org/license/mplv2hd.
#
# Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
# graphic logo is a trademark of OpenMRS Inc.

#!/bin/sh -x -e

PATH_OF_CURRENT_SCRIPT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $PATH_OF_CURRENT_SCRIPT/vagrant_functions.sh
#USER=jss
USER=bahmni

run_in_vagrant -c "sudo rm -rf implementer_interface"
run_in_vagrant -c "sudo ln -s /bahmni/implementer-interface/dist/ /var/www/implementer_interface"
run_in_vagrant -c "sudo chown -h ${USER}:${USER} /var/www/implementer_interface"
