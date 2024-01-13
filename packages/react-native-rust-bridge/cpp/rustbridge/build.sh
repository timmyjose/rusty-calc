#!/usr/bin/env bash

set -euxo pipefail

EAS_BUILD_PLATFORM=${EAS_BUILD_PLATFORM:-""}

# common cleanup (if requested)
# ignore clean errors if they occur
if [[ "$@" == *"--clean"* ]]
then
    (
        echo "Doing a clean build..."
        set +e
        set -x
        cargo clean
        set -e
    )
fi
rm -rf rustbridge.xcframework
rm -rf ../target

# iOS
if [[ "$EAS_BUILD_PLATFORM" == "ios" || -z "$EAS_BUILD_PLATFORM" ]]; then
    mkdir -p dist/aarch64-apple-ios
    mkdir -p dist/aarch64-apple-ios-sim
    mkdir -p dist/x86_64-apple-ios

    cargo pod build --ios -- --release

    xcodebuild -create-xcframework \
    -library dist/aarch64-apple-ios/librustbridge.a \
    -library dist/aarch64-apple-ios-sim/librustbridge.a \
    -output rustbridge.xcframework

    mkdir -p ../target
    cp -rf rustbridge.xcframework ../target
fi

# Android
if [[ "$EAS_BUILD_PLATFORM" == "android" || -z "$EAS_BUILD_PLATFORM" ]]; then
    export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/26.1.10909125"
    
    # NOTE for CI: this requires the `cargo-ndk`tool to be already installed.
    cargo ndk --target aarch64-linux-android --platform 21 -- build --release
    # cargo ndk --target armv7-linux-androideabi --platform 21 -- build --release
    # cargo ndk --target i686-linux-android --platform 21 -- build --release
    cargo ndk --target x86_64-linux-android --platform 21 -- build --release

    mkdir -p ../target/aarch64-linux-android/release
    cp target/aarch64-linux-android/release/librustbridge.a ../target/aarch64-linux-android/release/

    # mkdir -p ../target/armv7-linux-androideabi/release
    # cp target/armv7-linux-androideabi/release/librustbridge.a ../target/armv7-linux-androideabi/release/

    # mkdir -p ../target/i686-linux-android/release
    # cp target/i686-linux-android/release/librustbridge.a ../target/i686-linux-android/release/

    mkdir -p ../target/x86_64-linux-android/release
    cp target/x86_64-linux-android/release/librustbridge.a ../target/x86_64-linux-android/release/

fi

# post-build cleanup
rm -rf dist ../../../../../dist target rustbridge.xcframework

