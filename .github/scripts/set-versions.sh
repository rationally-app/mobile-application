#!/bin/bash

stage=$1
build_version=$2
binary_version=$3

cat <<< "$(jq \
--arg stage "$stage" \
--arg build_version "$build_version" \
'.build[$stage].env.APP_BUILD_VERSION = $build_version' eas.json)" > eas.json

cat <<< "$(jq \
--arg stage "$stage" \
--arg binary_version "$binary_version" \
'.build[$stage].env.APP_BINARY_VERSION = $binary_version' eas.json)" > eas.json