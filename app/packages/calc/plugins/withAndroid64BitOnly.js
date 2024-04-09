// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withAppBuildGradle } = require('expo/config-plugins')

module.exports = function withAndroid64BitBuild(config) {
  return withAppBuildGradle(config, (config) => {
    const appBuildGradleContents = config.modResults.contents
    const defaultConfigSectionText = 'defaultConfig {'

    if (appBuildGradleContents.indexOf(defaultConfigSectionText) >= 0) {
      console.log('[withAndroid64BitOnly] `defaultConfig` section located. Adding `abiFilters` for `Android`')

      const ndkSectionContents = `
        // Injected by the \`withAndroid64BitOnly\` expo config plugin
        ndk {
          abiFilters 'x86_64', 'arm64-v8a'
        }`

      const ndkSectionStartIdx = appBuildGradleContents.indexOf(defaultConfigSectionText) + defaultConfigSectionText.length
      config.modResults.contents = 
        `${appBuildGradleContents.slice(0, ndkSectionStartIdx)}
         ${ndkSectionContents}
         ${appBuildGradleContents.slice(ndkSectionStartIdx)}
        `
    }

    return config
  })
}
