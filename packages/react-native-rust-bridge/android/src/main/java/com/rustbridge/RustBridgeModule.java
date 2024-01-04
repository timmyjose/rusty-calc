package com.rustbridge;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = RustBridgeModule.NAME)
public class RustBridgeModule extends NativeRustBridgeSpec {
  public static final String NAME = "RustBridge";

  public RustBridgeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  static {
    System.loadLibrary("react-native-rust-bridge");
  }

  private static native String nativeExecute(String cmd);

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @Override
  public void execute(String cmd, Promise promise) {
    promise.resolve(nativeExecute(cmd));
  }
}
