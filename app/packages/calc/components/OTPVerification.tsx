import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import PhoneInput from 'react-native-phone-number-input'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamsList } from '../App'
import { sendSmsVerification } from '../api/verify'

const OTPVerification = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamsList>>()

  const [value, setValue] = useState<string>('')
  const [formattedValue, setFormattedValue] = useState<string>('')
  const phoneInput = useRef<PhoneInput>(null)


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.welcome}>
          <Text>Welcome!</Text>
        </View>
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode='IN'
          layout='first'
          onChangeText={text => {
            setValue(text)
          }}
          onChangeFormattedText={text => {
            setFormattedValue(text)
          }}
          countryPickerProps={{ withAlphaFilter: true }}
          withShadow
          autoFocus
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            sendSmsVerification(formattedValue).then((sendStatus) => {
              console.log('Sent SMS for verification')
              navigation.navigate('Otp', { phoneNumber: formattedValue})
            })
          }}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <Button title='Go Back' onPress={() => navigation.goBack()} />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lighter
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: 20,
    height: 50,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7CDB8A",
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOffset: {
      width: 1,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10
  },
  buttonText: {
    color: "white",
    fontSize: 14
  },
  welcome: {
    padding: 20
  },
  status: {
    padding: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    color: "gray"
  }
})

export default OTPVerification