#!/usr/bin/env bash

set -eox pipefail

echo "EAS_BUILD_RUNNER: ${EAS_BUILD_RUNNER}"
echo "EAS_BUILD_PROFILE: ${EAS_BUILD_PROFILE}"

if [[ ("$EAS_BUILD_RUNNER" == "eas-build" || "$EAS_BUILD_RUNNER" == "local-build-plugin") && "$EAS_BUILD_PROFILE" == "test"* ]]; then
  if [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
    # Emulator must be API 31 -- API 32 and 33 fail due to https://github.com/wix/Detox/issues/3762
    # For local eas builds on macOS (Apple Silicon)
    if [[ "$OSTYPE" == "darwin"* ]]
    then
        echo "Pre Install Android Emulator setup for macOS (Apple Silicon)"
        $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --install "system-images;android-31;google_apis;arm64-v8a"
        $ANDROID_HOME/cmdline-tools/latest/bin/avdmanager --verbose create avd --force --name "pixel_4" --device "pixel_4" --package "system-images;android-31;google_apis;arm64-v8a"
    else
        echo "Pre Install Android Emulator setup for non-Darwin OS"
        sudo apt-get --quiet update --yes

        # Install emulator & video bridge dependencies
        # Source: https://github.com/react-native-community/docker-android/blob/master/Dockerfile
        sudo apt-get --quiet install --yes \
          libc6 \
          libdbus-1-3 \
          libfontconfig1 \
          libgcc1 \
          libpulse0 \
          libtinfo5 \
          libx11-6 \
          libxcb1 \
          libxdamage1 \
          libnss3 \
          libxcomposite1 \
          libxcursor1 \
          libxi6 \
          libxext6 \
          libxfixes3 \
          zlib1g \
          libgl1 \
          pulseaudio \
          socat
        sdkmanager --install "system-images;android-31;google_apis;x86_64"
        avdmanager --verbose create avd --force --name "pixel_4" --device "pixel_4" --package "system-images;android-31;google_apis;x86_64"
    fi
  else # eas build platform is iOS
    brew tap wix/brew
    brew install applesimutils
  fi
fi
