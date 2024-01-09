#!/usr/bin/env bash

set -euxo pipefail

source "$HOME/.cargo/env"

# install Android prerequisites
cargo install cargo-ndk

rustup target add aarch64-linux-android
rustup target add armv7-linux-androideabi
rustup target add i686-linux-android
rustup target add x86_64-linux-android
