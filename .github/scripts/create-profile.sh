#!/bin/bash

stage=$1

cat <<< "$(jq \
--arg stage "$stage" \
'.build[$stage].env.NODE_OPTIONS = "--max_old_space_size=7168"' eas.json)" > eas.json

cat <<< "$(jq \
--arg stage "$stage" \
--arg binary_version "$binary_version" \
'.build[$stage].releaseChannel = $stage' eas.json)" > eas.json
