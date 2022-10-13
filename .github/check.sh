#!/bin/bash

docker build -t bahmni/implementer-interface:local -f package/docker/Dockerfile .
export LOCAL_SHA=$(docker inspect bahmni/implementer-interface:local | grep "Id" | cut -d ':' -f 3 | cut -d '"' -f 1)
echo $LOCAL_SHA
docker pull bahmni/implementer-interface:latest
export REMOTE_SHA=$(docker inspect bahmni/implementer-interface:latest | grep "Id" | cut -d ':' -f 3 | cut -d '"' -f 1) 
echo $REMOTE_SHA
export IF_EQUALS=$([ "$LOCAL_SHA" = "$REMOTE_SHA" ] && echo "true" || echo "false")
echo $IF_EQUALS

