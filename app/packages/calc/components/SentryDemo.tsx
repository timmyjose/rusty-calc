import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { View, StyleSheet, Button } from 'react-native'
import { RootStackParamsList } from '../App'
import * as Sentry from 'sentry-expo'

const SentryDemo = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamsList>>()

  return (
    <View styles={styles.container}>
      <Button title='Go Back' onPress={() => navigation.goBack()} />
      <Button title='Test captureException' onPress={() => Sentry.Native.captureException(new Error('Sentry SourcesMap test captureException... no sentry-expo plugin'))} />
      <Button title='Test captureMessage' onPress={() => Sentry.Native.captureMessage('Sentry SourcesMaps test captureMessage... no sentry-expo plugin')} />
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
