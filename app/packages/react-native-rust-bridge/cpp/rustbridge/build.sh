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

# optimise for all builds
export RUSTFLAGS='-C embed-bitcode=yes -C lto=on' 

# iOS
if [[ "$EAS_BUILD_PLATFORM" == "ios" || -z "$EAS_BUILD_PLATFORM" ]]; then
    mkdir -p dist/aarch64-apple-ios
    mkdir -p dist/aarch64-apple-ios-sim
    mkdir -p dist/x86_64-apple-ios

    RUST_LOG=info cargo pod build --ios -- --release

    xcodebuild -create-xcframework \
    -library dist/aarch64-apple-ios/librustbridge.a \
    -library dist/aarch64-apple-ios-sim/librustbridge.a \
    -output rustbridge.xcframework

    mkdir -p ../target
    cp -rf rustbridge.xcframework ../target
fi

# Android
if [[ "$EAS_BUILD_PLATFORM" == "android" || -z "$EAS_BUILD_PLATFORM" ]]; then
  # We don't check for ANDROID_NDK_HOME directly since we want the latest version, 
  # not the version that may have been set in the ANDROID_NDK_HOME env var.
  ANDROID_HOME=${ANDROID_HOME:-""}

  echo "Check ANDROID_HOME = ${ANDROID_HOME}"

  if [[ -z "${ANDROID_HOME}" ]]; then
    echo "ANDROID_HOME not set. Aborting..."
    exit 1
  fi

  echo "ANDROID_HOME = ${ANDROID_HOME}"

  if [[ ! -d "${ANDROID_HOME}" ]]; then
    echo "ANDROID_HOME directory does not exist. Aborting..."
    exit 1
  fi

  LATEST_NDK_VERSION=$(ls -f "${ANDROID_HOME}"/ndk | sort -V | tail -n 1)
  echo "Latest NDK version = ${LATEST_NDK_VERSION}"

  ANDROID_NDK_HOME="${ANDROID_HOME}/ndk/${LATEST_NDK_VERSION}"
  echo "Set ANDROID_NDK_HOME= ${ANDROID_NDK_HOME}"

  if [[ ! -d "${ANDROID_NDK_HOME}" ]]; then
    echo "No NDK installation found. Aborting..."
    exit 1
  fi

  # NOTE for CI: this requires the `cargo-ndk`tool to be already installed.
  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    SYSROOT_PATH="${ANDROID_NDK_HOME}/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/lib/aarch64-linux-android"
    BINDGEN_EXTRA_CLANG_ARGS="--sysroot ${SYSROOT_PATH}" cargo ndk --bindgen --target aarch64-linux-android --platform 21 -- build --release
  else
    cargo ndk --bindgen --target aarch64-linux-android --platform 21 -- build --release
  fi

  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    SYSROOT_PATH="${ANDROID_NDK_HOME}/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/lib/armv7-linux--androideabi"
    BINDGEN_EXTRA_CLANG_ARGS="--sysroot ${SYSROOT_PATH}" cargo ndk --bindgen --target armv7-linux-androideabi --platform 21 -- build --release
  else
    cargo ndk --bindgen --target armv7-linux-androideabi --platform 21 -- build --release
  fi

  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    SYSROOT_PATH="${ANDROID_NDK_HOME}/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/lib/i686-linux-android"
    BINDGEN_EXTRA_CLANG_ARGS="--sysroot ${SYSROOT_PATH}" cargo ndk --bindgen --target i686-linux-android --platform 21 -- build --release
  else
    cargo ndk --bindgen --target i686-linux-android --platform 21 -- build --release
  fi

  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    SYSROOT_PATH="${ANDROID_NDK_HOME}/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/lib/x86_64-linux-android"
    BINDGEN_EXTRA_CLANG_ARGS="--sysroot ${SYSROOT_PATH}" cargo ndk --bindgen --target x86_64-linux-android --platform 21 -- build --release
  else
    cargo ndk --bindgen --target x86_64-linux-android --platform 21 -- build --release
  fi

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

