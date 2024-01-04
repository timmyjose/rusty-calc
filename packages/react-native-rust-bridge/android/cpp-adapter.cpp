#include <jni.h>
#include "react-native-rust-bridge.h"

extern "C"
JNIEXPORT jstring JNICALL
Java_com_rustbridge_RustBridgeModule_nativeExecute(JNIEnv *env, jclass type, jstring cmd) {
    const char *native_cmd = env->GetStringUTFChars(cmd, JNI_FALSE);
    if (native_cmd == nullptr) {
        return nullptr;
    }
    const char *res = rustbridge::execute(native_cmd);
    env->ReleaseStringUTFChars(cmd, native_cmd);

    return env->NewStringUTF(res);
}
