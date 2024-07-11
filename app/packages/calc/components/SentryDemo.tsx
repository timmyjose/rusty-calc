import { Button, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamsList } from '../App'
import * as Sentry from 'sentry-expo'

const SentryDemo = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamsList>>()

  return (
    <View style={styles.container}>
      <Button title='Go Back' onPress={() => navigation.goBack()} />
      <Button title='Test Sentry (captureException)' onPress={() => Sentry.Native.captureException(new Error('Testing Sentry sourcemaps on expo-49'))} />
      <Button title='Test Sentry (captureMessage)' onPress={() => Sentry.Native.captureMessage('Raw error wrapped')} />
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

export default SentryDemo
