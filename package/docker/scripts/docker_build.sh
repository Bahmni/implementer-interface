#!/bin/bash
set -xe

# yarn install --frozen-lockfile
# yarn ci

#Building Docker images
IMPLEMENTER_INTERFACE_IMAGE_TAG=${BAHMNI_VERSION:?}-${GITHUB_RUN_NUMBER:?}
docker build -t bahmni/implementer-interface:${IMPLEMENTER_INTERFACE_IMAGE_TAG} -f package/docker/Dockerfile  . --no-cache
