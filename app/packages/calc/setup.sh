#!/usr/bin/env bash

set -euxo pipefail

ANDROID_PREBUILD_DIR="android"
IOS_PREBUILD_DIR="ios"

if [[ "$@" == *"--clean"* ]]
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

    # update the generated `android/app/build.gradle` to only build for 64-bit platforms/archs
    APP_GRADLE_FILE="android/app/build.gradle"
    echo "Updating ${APP_GRADLE_FILE} to only build for 64-bit archs"

    if [[ "$OSTYPE" == "darwin"* ]]
    then
      echo "[macOS] Updating android/app/build.gradle"
      sed -i '' '/defaultConfig {/a \
            ndk { \
                abiFilters '\''x86_64'\'', '\''arm64-v8a'\'' \
            }
            ' "$APP_GRADLE_FILE"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]
    then
      echo "[Linux] Updating android/app/build.gradle"
      sed -i '/defaultConfig {/a \
            ndk { \
                abiFilters '\''x86_64'\'', '\''arm64-v8a'\'' \
            }
            ' "$APP_GRADLE_FILE"
    else
        echo "Unsupported OS. Aborting..."
        exit 1
    fi
fi

# run setup for the react-native-rust-bridge dependency
yarn workspace react-native-rust-bridge clean
yarn workspace react-native-rust-bridge setup
yarn workspace react-native-rust-bridge build "$@" # pass any flags such as `--clean` to the build script
