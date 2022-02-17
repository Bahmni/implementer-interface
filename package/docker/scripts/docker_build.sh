#!/bin/bash
set -xe

# Build Artifact `implementer-interface.zip` should be placed in dist directory in the root of repository

#Building Docker images
IMPLEMENTER_INTERFACE_IMAGE_TAG=${BAHMNI_VERSION:?}-${GITHUB_RUN_NUMBER:?}
docker build -t bahmni/implementer-interface:${IMPLEMENTER_INTERFACE_IMAGE_TAG} -f package/docker/Dockerfile  . --no-cache
