#!/usr/bin/env bash

set -euxo pipefail

# install Android prerequisites

cargo install cargo-ndk --locked

rustup target add aarch64-linux-android
rustup target add armv7-linux-androideabi
rustup target add i686-linux-android
rustup target add x86_64-linux-android

# install iOS prerequisites

cargo install cargo-cocoapods --locked

rustup target add aarch64-apple-ios
rustup target add aarch64-apple-ios-sim
rustup target add x86_64-apple-ios
