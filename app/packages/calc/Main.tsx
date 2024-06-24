import React, { useState } from 'react'
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { execute } from 'react-native-rust-bridge'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamsList } from './App'

const Main = () => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [result, setResult] = useState(0)

  const handleAdd = async () => {
    const addCmd = JSON.stringify({
      Add: {
        x,
        y
      }
    })

    const sum = JSON.parse(await execute(addCmd))
    setResult(sum.res)
  }

  const handleSub = async () => {
    const subCmd = JSON.stringify({
      Sub: {
        x,
        y
      }
    })

    const diff = JSON.parse(await execute(subCmd))
    setResult(diff.res)
  }

  const handleMul = async () => {
    const mulCmd = JSON.stringify({
      Mul: {
        x,
        y
      }
    })

    const prod = JSON.parse(await execute(mulCmd))
    setResult(prod.res)
  }

  const handleDiv = async () => {
    const divCmd = JSON.stringify({
      Div: {
        x,
        y
      }
    })

    const quot = JSON.parse(await execute(divCmd))
    setResult(quot.res)
  }

  const handleAbs = async () => {
    const absCmd = JSON.stringify({
      Abs: {
        x
      }
    })

    const absRes = JSON.parse(await execute(absCmd))
    setResult(absRes.res)
  }

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamsList>>()

  return (
    <View style={styles.container}>
      <Button testID='app-button-backup' title='Backup' onPress={() => navigation.navigate('Backup')}/>
      <Button testID='app-button-version-number' title='VersionNumber' onPress={() => navigation.navigate('VersionNumberInfo')}/>
      <Button title='Device Info' onPress={() => navigation.navigate('DeviceInformation')} />
      <Button title='OTP Demo' onPress={() => navigation.navigate('OTPDemo')} />
      <TextInput
        testID='app-textinput-x'
        style={styles.input}
        placeholder="Enter first number"
        keyboardType='numeric'
        value={x.toString()}
        onChangeText={(text: string) => setX(parseFloat(text))}
      />

      <TextInput
        testID='app-textinput-y'
        style={styles.input}
        placeholder="Enter second number"
        value={y.toString()}
        onChangeText={(text: string) => setY(parseFloat(text))}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} testID='app-button-add' onPress={handleAdd}><Text style={styles.buttonText}>Add</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} testID='app-button-sub' onPress={handleSub}><Text style={styles.buttonText}>Sub</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} testID='app-button-mul' onPress={handleMul}><Text style={styles.buttonText}>Mul</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} testID='app-button-div' onPress={handleDiv}><Text style={styles.buttonText}>Div</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} testID='app-button-abs' onPress={handleAbs}><Text style={styles.buttonText}>Abs</Text></TouchableOpacity>
      </View>

      <Text testID='app-text-res' style={styles.resultText}>Result: {result}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultText: {
    fontSize: 20,
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%'
  },
  button: {
    marginTop: 20,
    height: 20,
    width: '15%',
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
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10
  }
})

export default Main
