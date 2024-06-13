import { Button, StyleSheet, Text, View } from 'react-native'
import VersionNumber from 'react-native-version-number'
import { useNavigation } from '@react-navigation/native'

export default function VersionNumberInfo() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text>appVersion: {VersionNumber.appVersion}</Text>
      <Text>buildVersion: {VersionNumber.buildVersion}</Text>
      <Text>bundleIdentifier: {VersionNumber.bundleIdentifier}</Text>
      <Button title='Go Back' onPress={() => navigation.goBack()}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
