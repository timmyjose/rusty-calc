#!/usr/bin/env bash

set -euxo pipefail

ANDROID_PREBUILD_DIR="android"
IOS_PREBUILD_DIR="ios"

if [[ "$@" == *"--clean"* || "$@" == *"--full-clean"* ]]
then
    (
        echo "Doing a clean build..."
        set +e
        set -x
        echo "Removing app/node_modules"
        rm -rf ../../node_modules
        echo "Removing ios and android directories"
        rm -rf ios android
        set -e
    )
fi

# Trigger yarn install for `expo` to be available for prebuild
yarn install

# prepare the config plugin
echo "Preparing the Android Backup Agent plugin"
yarn workspace android-kv-backup-agent clean
yarn workspace android-kv-backup-agent prepare

# Function to check if cargo is installed
function check_cargo() {
    command -v cargo >/dev/null 2>&1
}

# Check if cargo is installed. If not, install it.
if ! check_cargo; then
    echo "Cargo is not installed. Installing now..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
else
    echo "Cargo is already installed."
fi

# run `prebuild` iff the `android` and `iOS` directories do not exist
if [[ ! -d ${ANDROID_PREBUILD_DIR} ]] || [[ ! -d ${IOS_PREBUILD_DIR} ]]
then
    echo "Missing android and/or iOS directories, running expo prebuild..."
    npx expo prebuild
fi

# run setup for the react-native-rust-bridge dependency
yarn workspace react-native-rust-bridge clean
yarn workspace react-native-rust-bridge setup
yarn workspace react-native-rust-bridge build "$@" # pass any flags such as `--clean` to the build script
yarn workspace react-native-rust-bridge prepare
