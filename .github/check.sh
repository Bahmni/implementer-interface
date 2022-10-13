!/bin/bash
bahmni_image_data=$(echo $(curl -X GET https://hub.docker.com/v2/repositories/bahmni/implementer-interface/tags/latest) | jq -r '.tag_last_pushed' | cut -d 'T' -f 1)
bahmni_image_creation_time =$(date -d $bahmni_image_data +%s)
base_image_data=$(echo $(curl -X GET https://hub.docker.com/v2/repositories/library/httpd/tags/2.4-alpine) | jq -r '.tag_last_pushed' | cut -d 'T' -f 1)
base_image_creation_time=$(date -d $base_image_data +%s)


# function check_if_needs_rebuild(org,image_name,image_tag,base_image_org,base_image_name,base_image_tag){
bahmni_image_data=$(echo $(curl -X GET https://hub.docker.com/v2/repositories/bahmni/implementer-interface/tags/latest) | jq -r '.tag_last_pushed' | cut -d 'T' -f 1)
bahmni_image_creation_time =$(date -d $bahmni_image_data +%s)
base_image_data=$(echo $(curl -X GET https://hub.docker.com/v2/repositories/library/httpd/tags/2.4-alpine) | jq -r '.tag_last_pushed' | cut -d 'T' -f 1)
base_image_creation_time=$(date -d $base_image_data +%s)

if expr "$bahmni_image_creation_time" "<=" "$base_image_creation_time" >/dev/null; then
    echo "bahmni image was created earlier than base image"
    echo "$REBUILD=TRUE"
else
    echo "bahmni image was created later than base image"
    echo "$REBUILD=FALSE"
fi
# }

# check_if_needs_rebuild