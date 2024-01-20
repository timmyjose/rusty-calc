package com.rustbridge;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;

abstract class RustBridgeSpec extends ReactContextBaseJavaModule {
  RustBridgeSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void execute(String cmd, Promise promise);
}
