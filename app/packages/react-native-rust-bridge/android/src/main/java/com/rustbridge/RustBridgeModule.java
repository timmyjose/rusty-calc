package com.rustbridge;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

public class RustBridgeModule extends RustBridgeSpec {
  public static final String NAME = "RustBridge";

  RustBridgeModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  static {
    System.loadLibrary("react-native-rust-bridge");
  }

  public static native String nativeExecute(String cmd);

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void execute(String cmd, Promise promise) {
    promise.resolve(nativeExecute(cmd));
  }
}
