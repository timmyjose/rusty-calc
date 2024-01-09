#!/usr/bin/env bash

set -euxo pipefail

source "$HOME/.cargo/env"

# common cleanup
# ignore clean errors if they occur
(
    set +e
    set -x
    cargo clean
    set -e
)
rm -rf ../target

# Android
#export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/26.1.10909125"

# NOTE for CI: this requires the `cargo-ndk`tool to be already installed.
cargo ndk --target aarch64-linux-android --platform 23 -- build --release
cargo ndk --target armv7-linux-androideabi --platform 23 -- build --release
cargo ndk --target i686-linux-android --platform 23 -- build --release
cargo ndk --target x86_64-linux-android --platform 23 -- build --release

mkdir -p ../target/aarch64-linux-android/release
cp target/aarch64-linux-android/release/librustbridge.a ../target/aarch64-linux-android/release/

mkdir -p ../target/armv7-linux-androideabi/release
cp target/armv7-linux-androideabi/release/librustbridge.a ../target/armv7-linux-androideabi/release/

mkdir -p ../target/i686-linux-android/release
cp target/i686-linux-android/release/librustbridge.a ../target/i686-linux-android/release/

mkdir -p ../target/x86_64-linux-android/release
cp target/x86_64-linux-android/release/librustbridge.a ../target/x86_64-linux-android/release/

# post-build cleanup
rm -rf target
