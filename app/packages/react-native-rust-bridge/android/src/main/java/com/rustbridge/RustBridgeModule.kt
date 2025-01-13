package com.rustbridge

import androidx.annotation.NonNull
import android.util.Log

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RustBridgeModule.NAME)
class RustBridgeModule(reactContext: ReactApplicationContext) :
NativeRustBridgeSpec(reactContext) {

override fun getName(): String {
    return NAME
  }

  external fun nativeExecute(cmd: String): String

  override fun execute(cmd: String, promise: Promise) {
    try {
      Log.i(NAME, "About to execute command") 
      promise.resolve(nativeExecute(cmd))
    } catch (err: Throwable) {
      Log.e(NAME, "Error while executing command: ${err.message} ", err)
    }
  }

  companion object {
    const val NAME = "RustBridge"
    init {
      Log.i(NAME, "About to load react-native-rust-bridge");
      System.loadLibrary("react-native-rust-bridge")
      Log.i(NAME, "Successfully loaded react-native-rust-bridge");
    }
  }
}
