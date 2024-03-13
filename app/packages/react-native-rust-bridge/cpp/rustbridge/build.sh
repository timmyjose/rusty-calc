#!/usr/bin/env bash

set -euxo pipefail

EAS_BUILD_PLATFORM=${EAS_BUILD_PLATFORM:-""}

# common cleanup (if requested)
# ignore clean errors if they occur
if [[ "$@" == *"--full-clean"* ]]
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
  ANDROID_HOME=
  ANDROID_NDK_HOME=

  if [[ -z "${ANDROID_HOME}" ]]; then
    export ANDROID_HOME=~/Library/Android/sdk
  fi

  echo "ANDROID_HOME = ${ANDROID_HOME}"

  if [[ ! -d "${ANDROID_HOME}"/ndk ]]; then
    echo "No NDK installation found"
    exit 1
  fi

  LATEST_NDK_VERSION=$(ls -f "${ANDROID_HOME}/ndk" | sort -V | tail -n 1)
  echo "Latest NDK version = ${LATEST_NDK_VERSION}"

  ANDROID_NDK_HOME="${ANDROID_HOME}/ndk/${LATEST_NDK_VERSION}"
  echo "ANDROID_NDK_HOME= ${ANDROID_NDK_HOME}"

  if [[ ! -d "${ANDROID_NDK_HOME}" ]]
  then
    echo "ANDROID_NDK_HOME directory does not exist. Aborting..."
    exit 1
  fi

  # NOTE for CI: this requires the `cargo-ndk`tool to be already installed.
  cargo ndk --target aarch64-linux-android --platform 21 -- build --release
  cargo ndk --target armv7-linux-androideabi --platform 21 -- build --release
  cargo ndk --target i686-linux-android --platform 21 -- build --release
  cargo ndk --target x86_64-linux-android --platform 21 -- build --release

  mkdir -p ../target/aarch64-linux-android/release
  cp target/aarch64-linux-android/release/librustbridge.a ../target/aarch64-linux-android/release/

  mkdir -p ../target/armv7-linux-androideabi/release
  cp target/armv7-linux-androideabi/release/librustbridge.a ../target/armv7-linux-androideabi/release/

  mkdir -p ../target/i686-linux-android/release
  cp target/i686-linux-android/release/librustbridge.a ../target/i686-linux-android/release/

  mkdir -p ../target/x86_64-linux-android/release
  cp target/x86_64-linux-android/release/librustbridge.a ../target/x86_64-linux-android/release/
fi

# post-build cleanup
rm -rf dist ../../../../../dist target rustbridge.xcframework

