iOS:

1. Install https://github.com/wix/AppleSimulatorUtils

Command:
$ EAS_LOCAL_BUILD_WORKINGDIR=~/dev/playground/e2e/builds/ios/ eas build -p ios -e test --non-interactive --local

Full command:

$ EAS_LOCAL_BUILD_SKIP_CLEANUPE=1 EAS_LOCAL_BUILD_WORKINGDIR=~/dev/playground/e2e/builds/ios/ eas build -p ios -e test --non-interactive --local


Android:

1. Create an AVD (Pixel 4, whichever base is needed) and name it as "Pixel 4".

$ EAS_LOCAL_BUILD_WORKINGDIR=~/dev/playground/e2e/builds/ios/ eas build -p android -e test --non-interactive --local
$ EAS_LOCAL_BUILD_SKIP_CLEANUPE=1 EAS_LOCAL_BUILD_WORKINGDIR=~/dev/playground/e2e/builds/android/ eas build -p android -e test --non-interactive --local
