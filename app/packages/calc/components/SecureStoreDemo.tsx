import { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamsList } from '../App'
import * as SecureStore from 'expo-secure-store'

export default function SecureStoreDemo() {
  const [secureStoreAvailable, setSecureStoreAvailable] = useState<boolean>(false)

  useEffect(() => {
    const checkSecureStoreAvailability = async () => {
      const isAvailable = await SecureStore.isAvailableAsync()
      setSecureStoreAvailable(isAvailable)
    }

    checkSecureStoreAvailability()
  }, [])

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamsList>>()

  return (
    <View style={styles.container}>
      <Button title='Go Back' onPress={() => navigation.goBack()} />
      <Text>Is SecureStore available? {secureStoreAvailable.toString()}</Text>
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
