import { NativeModules, Platform } from 'react-native'

const LINKING_ERROR =
  'The package \'react-native-rust-bridge\' doesn\'t seem to be linked. Make sure: \n\n' +
  Platform.select({ ios: '- You have run \'pod install\'\n', default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n'

// @ts-expect-error check if Turbo Modules are enabled
const isTurboModuleEnabled = global.__turboModuleProxy != null

const RustBridgeModule = isTurboModuleEnabled
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ? require('./NativeRustBridge').default
  : NativeModules.RustBridge

const RustBridge = RustBridgeModule || new Proxy(
  {},
  {
    get() {
      throw new Error(LINKING_ERROR)
    }
  }
)

export function execute(cmd: string): Promise<string> {
  return RustBridge.execute(cmd)
}
