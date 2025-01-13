#import "RustBridge.h"

@implementation RustBridge
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(execute:(NSString*)cmd
  resolve:(RCTPromiseResolveBlock)resolve 
  reject:(RCTPromiseRejectBlock)reject)
{
    NSString *result = @(rustbridge::execute([cmd UTF8String]));
    resolve(result);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRustBridgeSpecJSI>(params);
}

@end
