import RustBridge from './NativeRustBridge'

export function execute(cmd: string): Promise<string> {
  return RustBridge.execute(cmd)
}
