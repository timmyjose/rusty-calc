import ExpoNativeConfigurationModule from "./ExpoNativeConfigurationModule"

export function getApiKey(): string {
  return ExpoNativeConfigurationModule.getApiKey()
}
