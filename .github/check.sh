!/bin/bash
bahmni_image_data=$(echo $(curl -X GET https://hub.docker.com/v2/repositories/bahmni/implementer-interface/tags/latest) | jq -r '.tag_last_pushed')
bahmni_image_creation_time=$(date -d $bahmni_image_data +%s)
base_image_data=$(echo $(curl -X GET https://hub.docker.com/v2/repositories/library/httpd/tags/2.4-alpine) | jq -r '.tag_last_pushed')
base_image_creation_time=$(date -d $base_image_data +%s)

if expr "$bahmni_image_creation_time" "<=" "$base_image_creation_time" >/dev/null; then
    echo "REBUILD=TRUE"  >> $GITHUB_ENV
    echo "bahmni image was created earlier than base image"
else
    echo "REBUILD=FALSE" >> $GITHUB_ENV
    echo "bahmni image was created later than base image"
fi