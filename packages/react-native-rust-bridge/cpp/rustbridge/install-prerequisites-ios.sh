#!/usr/bin/env bash

set -euxo pipefail

source "$HOME/.cargo/env"

# install iOS prerequisites

cargo install cargo-cocoapods --locked

rustup target add aarch64-apple-ios
rustup target add aarch64-apple-ios-sim
rustup target add x86_64-apple-ios
