import { useNavigation } from '@react-navigation/native'
import { Button, Text, View } from "react-native"
import * as ExpoNativeConfiguration from 'timmyjose-expo-native-configuration'

export default function ApiKey() {
  const navigation = useNavigation()

  return (
    <View style={{flex: 1, alignItems:'center', justifyContent: 'center'}}>
      <Text>Api Key: {ExpoNativeConfiguration.default()}</Text>
      <Button title='Go Back' onPress={() => navigation.goBack()}/>
    </View>
  )
}