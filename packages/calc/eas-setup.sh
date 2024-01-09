#!/usr/bin/env bash

set -euxo pipefail

# install rustup and Cargo
curl https://sh.rustup.rs -sSf | sh -s -- -y
source "$HOME/.cargo/env"

# Android
if [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
    # install Android prerequisites
    cargo install cargo-ndk --locked

    rustup target add aarch64-linux-android
    rustup target add armv7-linux-androideabi
    rustup target add i686-linux-android
    rustup target add x86_64-linux-android

    # run setup for the react-native-rust-bridge dependency
    yarn workspace react-native-rust-bridge clean 
    yarn workspace react-native-rust-bridge setup:android 
    yarn workspace react-native-rust-bridge build:android
fi 

# iOS
if [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
    # install iOS prerequisites

    cargo install cargo-cocoapods --locked

    rustup target add aarch64-apple-ios
    rustup target add aarch64-apple-ios-sim
    rustup target add x86_64-apple-ios

    # run setup for the react-native-rust-bridge dependency
    yarn workspace react-native-rust-bridge setup:ios 
    yarn workspace react-native-rust-bridge build:ios
fi
