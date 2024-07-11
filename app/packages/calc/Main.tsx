import { useState } from 'react'
import { View, TextInput, Button, Text, StyleSheet } from 'react-native'
import { execute } from 'react-native-rust-bridge'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamsList } from './App'
import * as Sentry from 'sentry-expo'

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

    try {
      const sum = JSON.parse(await execute(addCmd))
      setResult(sum.res)

      if (y === 42) {
        throw Error('So long and thanks for the fish - add')
      }
    } catch (err: any) {
      Sentry.React.captureException(err)
    }
  }

  const handleSub = async () => {
    const subCmd = JSON.stringify({
      Sub: {
        x,
        y
      }
    })

    try {
      const diff = JSON.parse(await execute(subCmd))
      setResult(diff.res)

      if (y === 42) {
        throw Error('So long and thanks for the fish - sub')
      }
    } catch (err: any) {
      Sentry.React.captureException(err)
    }
  }

  const handleMul = async () => {
    const mulCmd = JSON.stringify({
      Mul: {
        x,
        y
      }
    })

    try {
      const prod = JSON.parse(await execute(mulCmd))
      setResult(prod.res)

      if (y === 42) {
        throw Error('So long and thanks for all the fish - mul')
      }
    } catch (err: any) {
      Sentry.React.captureException(err)
    }
  }

  const handleDiv = async () => {
    const divCmd = JSON.stringify({
      Div: {
        x,
        y
      }
    })

    try {
      const quot = JSON.parse(await execute(divCmd))
      setResult(quot.res)

      if (y === 0) {
        throw Error('Attempt to divide by 0')
      }
    } catch (err: any) {
      Sentry.React.captureException(err)
    }
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
      <Text>Testing sourcemap uploads for eas updates - using Sentry.React.captureException</Text>
      <Button testID='app-button-backup' title='Backup' onPress={() => navigation.navigate('Backup')}/>
      <Button testID='app-button-version-number' title='VersionNumber' onPress={() => navigation.navigate('VersionNumberInfo')}/>
      <Button title='Device Info' onPress={() => navigation.navigate('DeviceInformation')} />
      <Button title='Secure Store Demo' onPress={() => navigation.navigate('SecureStoreDemo')} />
      <Button title='Sentry Demo' onPress={() => navigation.navigate('SentryDemo')} />
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
