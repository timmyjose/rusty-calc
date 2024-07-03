import { Button, StyleSheet, Text, View } from 'react-native'
import VersionNumber from 'react-native-version-number'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamsList } from '../App'

export default function VersionNumberInfo() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamsList>>()

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
