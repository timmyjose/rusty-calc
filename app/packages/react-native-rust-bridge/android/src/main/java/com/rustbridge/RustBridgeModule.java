package com.rustbridge;

import androidx.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

public class RustBridgeModule extends RustBridgeSpec {
  public static final String NAME = "RustBridge";
  private static final String TAG = "RustBridge";

  RustBridgeModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  static {
    Log.i(NAME, "About to load react-native-rust-bridge");
    System.loadLibrary("react-native-rust-bridge");
    Log.i(NAME, "Successfully loaded react-native-rust-bridge");
  }

  public static native String nativeExecute(String cmd);

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void execute(String cmd, Promise promise) {
    try {
      Log.i(NAME, "About to execute command: " + cmd);
      String cmdRes = nativeExecute(cmd);
      promise.resolve(cmdRes);
    } catch (Throwable err) {
      Log.e(NAME, "Error while executing command: " + cmd, err);
    }
  }
}
