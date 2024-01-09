#!/usr/bin/env bash

set -euxo pipefail

source "$HOME/.cargo/env"

# common cleanup
# ignore clean errors if they occur
if [[ "$@" == *"--clean"* ]]; then
    echo "Cleaning"
    set +e
    set -x
    cargo clean
    set -e
fi
rm -rf rustbridge.xcframework
rm -rf ../target

# iOS
cargo pod build --ios -- --release

xcodebuild -create-xcframework \
-library dist/aarch64-apple-ios/librustbridge.a \
-library dist/aarch64-apple-ios-sim/librustbridge.a \
-output rustbridge.xcframework

mkdir -p ../target
cp -rf rustbridge.xcframework ../target

# post-build cleanup
rm -rf dist target rustbridge.xcframework
