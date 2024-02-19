/* eslint-disable prettier/prettier */
import { withInfoPlist, withAndroidManifest, AndroidConfig, ConfigPlugin } from 'expo/config-plugins'

const withMyApiKey: ConfigPlugin<{ apiKey: string }> = (config, { apiKey }) => {
  // for iOS
  config = withInfoPlist(config, config => {
    config.modResults['MY_CUSTOM_API_KEY'] = apiKey
    return config
  })

  // for Android
  config = withAndroidManifest(config, config => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults)

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
       mainApplication,
       'MY_CUSTOM_API_KEY',
      apiKey
     )

    return config
    })
  return config
}

export default withMyApiKey

