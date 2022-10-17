!/bin/bash

##### Following are the inputs required to compare the base and manifest images.#######
ORG_NAME=$1
IMAGE_NAME=$2
IMAGE_TAG=$3
BASE_ORG_NAME=$4     # Use 'library' for official images and org name if using any third party base image.
BASE_IMAGE_NAME=$5
BASE_IMAGE_TAG=$6

bahmni_image_data=$(echo $(curl -X GET https://hub.docker.com/v2/repositories/$ORG_NAME/$IMAGE_NAME/tags/$IMAGE_TAG) | jq -r '.tag_last_pushed')
bahmni_image_creation_time=$(date -d $bahmni_image_data +%s)
base_image_data=$(echo $(curl -X GET https://hub.docker.com/v2/repositories/$BASE_ORG_NAME/$BASE_IMAGE_NAME/tags/$BASE_IMAGE_TAG) | jq -r '.tag_last_pushed')
base_image_creation_time=$(date -d $base_image_data +%s)

if expr "$bahmni_image_creation_time" "<=" "$base_image_creation_time" >/dev/null; then
    echo "REBUILD=update"  >> $GITHUB_ENV
    echo "bahmni image was created earlier than base image"
else
    echo "REBUILD=noUpdate" >> $GITHUB_ENV
    echo "bahmni image was created later than base image"
fi