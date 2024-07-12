# This script is used to perform `Sentry` SourceMap uploads for `eas` updates.
#
# Reference:
#  https://docs.expo.dev/guides/using-sentry/#uploading-source-maps-for-updates (expo-49 version)

import subprocess
import json
import os

BUNDLES_DIR = "dist/bundles"
UPDATE_BRANCH = "mobile-release-expo-update"
BUNDLE_IDENTIFIER = "com.timmyjose.rustycalc"
ANDROID_BUNDLE_NAME = "index.android.bundle"
IOS_BUNDLE_NAME = "main.jsbundle"

SOURCEMAP_UPDATE_CMD = """
../../node_modules/@sentry/cli/bin/sentry-cli releases \
    files {bundle_identifier}@{app_version}+{app_build_version} \
    upload-sourcemaps \
    --dist {update_id} \
    --rewrite \
    dist/bundles/{bundle_name} dist/bundles/{bundle_map}
"""


class SourceMapUpdateError(Exception):
    """
    Custom error type for sourcemap upload tasks
    """

    def __init__(self, errmsg):
        self.errmsg = errmsg

    def __str__(self):
        return repr(self.errmsg)

def exec_cmd(cmd):
    """
    Execute the command and return the result as a Python JSON object
    """
    cmd_res = subprocess.run(cmd, capture_output=True, text=True)

    if cmd_res.returncode != 0:
        raise SourceMapUpdateError(cmd_res.stderr)

    try:
        cmd_res_json = json.loads(cmd_res.stdout)
        return cmd_res_json
    except JSONDecodeError as e:
        raise SourceMapUpdateError(f"Failed to parse {cmd} output as JSON")

def process_bundle_files():
    """
    Rename dist/bundles/android-<hash>.hbc to index.android.bundle
    Rename dist/bundles/ios-<hash>.hbc to main.jsbundle

    Return the names [dist/bundles/android-<hash>.map, dist/bundles/ios-<hash>.map]
    """
    bundle_files = os.listdir(BUNDLES_DIR)
    android_hbc_file, ios_hbc_file = None, None
    android_map_file, ios_map_file = None, None

    for bundle_file in bundle_files:
        if bundle_file.endswith(".hbc"):
            if bundle_file.startswith("android-"):
                android_hbc_file = bundle_file
            elif bundle_file.startswith("ios-"):
                ios_hbc_file = bundle_file
        elif bundle_file.endswith(".map"):
            if bundle_file.startswith("android-"):
                android_map_file = bundle_file
            elif bundle_file.startswith("ios-"):
                ios_map_file = bundle_file

    if android_hbc_file is None or ios_hbc_file is None:
        raise SourceMapUpdateError("Could not find android and/or ios hbc file(s)")

    android_hbc_src = os.path.join(BUNDLES_DIR, android_hbc_file)
    android_hbc_dst = os.path.join(BUNDLES_DIR,ANDROID_BUNDLE_NAME)

    ios_hbc_src = os.path.join(BUNDLES_DIR, ios_hbc_file)
    ios_hbc_dst = os.path.join(BUNDLES_DIR, IOS_BUNDLE_NAME)

    os.rename(android_hbc_src, android_hbc_dst)
    os.rename(ios_hbc_src, ios_hbc_dst)
    print("hbc files renamed")

    return android_map_file, ios_map_file

def get_app_version_and_build_version(os):
    """
    Get the app version and app build version for the update
    """
    app_versions_cmd = ["eas", "build:list", "-p", os, "--json", "--limit=1", "--non-interactive"]
    app_versions_json = exec_cmd(app_versions_cmd)

    if app_versions_json and isinstance(app_versions_json, list) and len(app_versions_json) > 0:
        app_version = app_versions_json[0].get("appVersion")
        app_build_version = app_versions_json[0].get("appBuildVersion")
        return app_version, app_build_version

def get_update_ids(app_version):
    """
    Get the update ids for this update group
    """

    # Get the update group id
    update_group_cmd = [
        "eas",
        "update:list",
        f"--branch={UPDATE_BRANCH}",
        "--limit=1",
        "--non-interactive",
        "--json",
    ]
    update_group_json = exec_cmd(update_group_cmd)
    latest_update_group_id = update_group_json["currentPage"][0].get("group")

    # Now get the update ids for the android and ios updates
    update_ids_cmd = ["eas", "update:view", "--json", latest_update_group_id]
    update_ids_json = exec_cmd(update_ids_cmd)

    android_latest_update_id, android_runtime_version = None, None
    ios_latest_update_id, ios_runtime_version = None, None

    if update_ids_json and isinstance(update_ids_json, list) and len(update_ids_json) >= 2:
        update_1 = update_ids_json[0]
        if update_1.get("platform") == "ios":
            ios_latest_update_id = update_1.get("id")
            ios_runtime_version = update_1.get("runtimeVersion")
        else:
            android_latest_update_id = update_1.get("id")
            android_runtime_version = update_1.get("runtimeVersion")

        update_2 = update_ids_json[1]
        if update_2.get("platform") == "ios":
          ios_latest_update_id = update_2.get("id")
          ios_runtime_version = update_2.get("runtimeVersion")
        else:
            android_latest_update_id = update_2.get("id")
            android_runtime_version = update_2.get("runtimeVersion")
    else:
        raise SourceMapUpdateError("Failed to get valid update details")

    # This will not always be true, yes? Do we need to check this then?
    # assert android_runtime_version == ios_runtime_version

    # This should be true for eas updates conducted via CI (?)
    # assert app_version == android_runtime_version

    return android_latest_update_id, ios_latest_update_id

def update_sourcemaps(android_bundle_map, ios_bundle_map):
    """
    Execute the commands to upload sourcemaps for the updates to Sentry
    """
    android_app_version, android_app_build_version = get_app_version_and_build_version(
        "android"
    )
    ios_app_version, ios_app_build_version = get_app_version_and_build_version("ios")
    android_latest_update_id, ios_latest_update_id = get_update_ids(android_app_version)

    print("Performing Android sourcemap update")
    android_update_cmd = SOURCEMAP_UPDATE_CMD.format(
        bundle_identifier=BUNDLE_IDENTIFIER,
        app_version=android_app_version,
        app_build_version=android_app_build_version,
        update_id=android_latest_update_id,
        bundle_name=ANDROID_BUNDLE_NAME,
        bundle_map=android_bundle_map,
    )
    print(f"About to execute: {android_update_cmd}")
    subprocess.run(android_update_cmd, shell=True, check=True, capture_output=True, text=True)

    print("Performing iOS sourcemap update")
    ios_update_cmd = SOURCEMAP_UPDATE_CMD.format(
        bundle_identifier=BUNDLE_IDENTIFIER,
        app_version=ios_app_version,
        app_build_version=ios_app_build_version,
        update_id=ios_latest_update_id,
        bundle_name=IOS_BUNDLE_NAME,
        bundle_map=ios_bundle_map,
    )
    print(f"About to execute: {ios_update_cmd}")
    subprocess.run(ios_update_cmd, shell=True, check=True, capture_output=True, text=True)

def main():
    android_bundle_map, ios_bundle_map = process_bundle_files()
    update_sourcemaps(android_bundle_map, ios_bundle_map)

if __name__ == "__main__":
    main()
