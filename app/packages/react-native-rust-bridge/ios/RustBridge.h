#ifdef __cplusplus
#import "react-native-rust-bridge.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRustBridgeSpec.h"

@interface RustBridge : NSObject <NativeRustBridgeSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RustBridge : NSObject <RCTBridgeModule>
#endif

@end
