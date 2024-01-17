#!/usr/bin/env bash

set -euxo pipefail

EAS_BUILD_PLATFORM=${EAS_BUILD_PLATFORM:-""}

# install Android prerequisites
if [[ "$EAS_BUILD_PLATFORM" == "android" || -z "$EAS_BUILD_PLATFORM" ]]; then
    cargo install cargo-ndk --locked

    rustup target add aarch64-linux-android
    rustup target add armv7-linux-androideabi
    rustup target add i686-linux-android
    rustup target add x86_64-linux-android
fi


# install iOS prerequisites
if [[ "$EAS_BUILD_PLATFORM" == "ios" || -z "$EAS_BUILD_PLATFORM" ]]; then
    cargo install cargo-cocoapods --locked

    rustup target add aarch64-apple-ios
    rustup target add aarch64-apple-ios-sim
    rustup target add x86_64-apple-ios
fi
