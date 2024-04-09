// Source: https://github.com/wodin/rn-hce-test/blob/main/plugins/withAndroidApplicationAttributes.js (@wodin on Discord)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AndroidConfig, withAndroidManifest } = require('expo/config-plugins')

function addAttributesToApplication(androidManifest, attributes) {
  const app = AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest)

  if (app?.$) {
    app.$ = { ...app.$, ...attributes }
  }

  return androidManifest
}

module.exports = function withAndroidApplicationAttributes(config, attributes) {
  return withAndroidManifest(config, (config) => {
    config.modResults = addAttributesToApplication(config.modResults, attributes)
    return config
  })
}
