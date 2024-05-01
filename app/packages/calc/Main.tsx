import React, { useState } from 'react'
import { View, TextInput, Button, Text, StyleSheet } from 'react-native'
import { execute } from 'react-native-rust-bridge'
import { useNavigation } from '@react-navigation/native'

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

  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text>Update from mobile-release-expo-update</Text>
      <Text>Update from main</Text>
      <Button testID='app-button-backup' title='Backup' onPress={() => navigation.navigate('Backup')}/>
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
        <Button testID='app-button-add' title="Add" onPress={async() => await handleAdd()} />
        <Button testID='app-button-sub' title="Subtract" onPress={async() => await handleSub()} />
        <Button testID='app-button-mul' title="Multiply" onPress={async() => await handleMul()} />
        <Button testID='app-button-div' title="Divide" onPress={async() => await handleDiv()} />
        <Button testID='app-button-abs' title='Abs' onPress={(async() => await handleAbs())} />
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
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%'
  }
})

export default Main
