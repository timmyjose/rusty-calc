/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { View, TextInput, Button, Text, StyleSheet, StatusBar, Platform } from 'react-native'
import { execute } from 'react-native-rust-bridge'
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: 'https://f9a2977dfd43c60a55609e0efacbb162@o235927.ingest.sentry.io/4506624563609600',
  environment: 'Dev',
  debug: false,
  enabled: true
})

const App = () => {
 const [x, setX] = useState(0)
 const [y, setY] = useState(0)
 const [result, setResult] = useState(0)

 const handleAdd = async () => {
   const add_cmd = JSON.stringify({
     Add: {
      x,
      y
     }
   })

   try {
     const sum = JSON.parse(await execute(add_cmd))
     Sentry.captureMessage(`Adding ${x} and ${y}`)
     setResult(sum.res)
   } catch (err) {
     Sentry.captureException(err)
   }
 }

 const handleSub = async () => {
   const sub_cmd = JSON.stringify({
     Sub: {
      x,
      y
     }
   })

   try {
     const diff = JSON.parse(await execute(sub_cmd))
     Sentry.captureMessage(`Subtracting ${x} and ${y}`)
     setResult(diff.res)
   } catch (err) {
     Sentry.captureException(err)
   }
 }

 const handleMul = async () => {
   const mul_cmd = JSON.stringify({
     Mul: {
      x,
      y
     }
   })

   try {
     const prod = JSON.parse(await execute(mul_cmd))
     Sentry.captureMessage(`Multiplying ${x} and ${y}`)
     setResult(prod.res)
   } catch (err) {
     Sentry.captureException(err)
   }
 }

 const handleDiv = async () => {
   const div_cmd = JSON.stringify({
     Div: {
      x,
      y
     }
   })

   try {
     const quot = JSON.parse(await execute(div_cmd))
     Sentry.captureMessage(`Dividing ${x} and ${y}`)
     setResult(quot.res)
   } catch (err) {
     Sentry.captureException(err)
   }
 }


 return (
   <View style={styles.container}>
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
       {/* <Button testID='app-button-add' title="Add" onPress={async() => await handleAdd()} />
       <Button testID='app-button-sub' title="Subtract" onPress={async() => await handleSub()} />
       <Button testID='app-button-mul' title="Multiply" onPress={async() => await handleMul()} />
       <Button testID='app-button-div' title="Divide" onPress={async() => await handleDiv()} /> */}
       <Button title='(raw message)' onPress={() => { Sentry.captureMessage('A raw message') }} />
       <Button title='(raw error)' onPress={() => { Sentry.captureException(new Error('Some error again and again!')) }} />
       <Button title='(update error)' onPress={() => { Sentry.captureException(new Error('testing eas updates and source maps'))}} />
       <Button title='(crash)' onPress={() => { Sentry.nativeCrash() }} />
     </View>

     <Text testID='app-text-res' style={styles.resultText}>Result: {result}</Text>
   </View>
 )
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 resultText: {
   fontSize: 20,
   marginBottom: 10,
 },
 input: {
   height: 40,
   width: '80%',
   borderColor: 'gray',
   borderWidth: 1,
   marginBottom: 10,
   paddingHorizontal: 10,
 },
 buttonContainer: {
   flexDirection: 'row',
   justifyContent: 'space-around',
   width: '80%',
 },
})

export default Sentry.wrap(App)