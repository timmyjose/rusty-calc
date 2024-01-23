#!/usr/bin/env bash

echo "EAS_BUILD_RUNNER: ${EAS_BUILD_RUNNER}"
echo "EAS_BUILD_PROFILE: ${EAS_BUILD_PROFILE}"

function cleanup() {
  echo 'Cleaning up...'
  if [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
    # Kill emulator
    adb emu kill &
    # Stop the adb server manually
    adb kill-server
    disown
  fi
}

if [[ "$EAS_BUILD_PROFILE" != "test" ]]; then
  exit
fi

# Fail if anything errors
set -eox pipefail
# If this script exits, trap it first and clean up the emulator
trap cleanup EXIT

ANDROID_EMULATOR=pixel_4

if [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
  # Start the adb server manually
  adb start-server  

  # Start emulator
  # For local builds on macOS (Apple Silicon)
  if [[ "$OSTYPE" == "darwin"* ]]
  then
   $ANDROID_HOME/emulator/emulator @$ANDROID_EMULATOR -no-audio -no-boot-anim -no-window 2>&1 >/dev/null &
  else
   $ANDROID_SDK_ROOT/emulator/emulator @$ANDROID_EMULATOR -no-audio -no-boot-anim -no-window -use-system-libs 2>&1 >/dev/null &
  fi

  # Wait for emulator
  max_retry=10
  counter=0
  until adb shell getprop sys.boot_completed; do
    sleep 10
    [[ counter -eq $max_retry ]] && echo "Failed to start the emulator!" && exit 1
    counter=$((counter + 1))
  done

  # Execute Android tests
  if [[ "$EAS_BUILD_PROFILE" == "test" ]]; then
    echo "Running Android detox tests..."
    detox test --configuration android.release
  fi
else
  # Execute iOS tests
  if [[  "$EAS_BUILD_PROFILE" == "test" ]]; then
    echo "Running iOS detox tests..."
    detox test --configuration ios.release
  fi
fi