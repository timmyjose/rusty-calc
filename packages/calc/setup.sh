#!/usr/bin/env bash

set -euxo pipefail

ANDROID_PREBUILD_DIR="android"
IOS_PREBUILD_DIR="ios"

# run `prebuild` iff the `android` and `iOS` directories do not exist
if [[ ! -d ${ANDROID_PREBUILD_DIR} ]] || [[ ! -d ${IOS_PREBUILD_DIR} ]]
then
    echo "Missing android and/or iOS directories, running expo prebuild..."
    npx expo prebuild
fi

# run setup for the react-native-rust-bridge dependency
yarn workspace react-native-rust-bridge clean 
yarn workspace react-native-rust-bridge setup 
yarn workspace react-native-rust-bridge build
