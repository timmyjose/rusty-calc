const RustBridge = require('./NativeRustBridge').default;

export function execute(cmd: string): Promise<string> {
  return RustBridge.execute(cmd);
}
