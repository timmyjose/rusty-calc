/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Alert, View, TextInput, Button, Text, StyleSheet, StatusBar } from 'react-native'
import { execute } from 'react-native-rust-bridge'
import * as Updates from 'expo-updates'
import messaging from '@react-native-firebase/messaging'

const App = () => {
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

 const runTypeMessage = Updates.isEmbeddedLaunch
  ? 'This app is running from built-in code'
  : 'This app is running another update'

  // push notifications
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    if (requestUserPermission()) {
      // return FCM token key
      messaging().getToken().then(token => {
        console.log(token)
      })
    } else {
      console.log('Failed token status', authStatus)
    }

    // check whether an initial notification is available
    messaging().getInitialNotification()
    .then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage?.notification)
      }
    })

    // when the application is running in the background
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification)
    })

    // register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background', remoteMessage)
    })

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message has arrived!', JSON.stringify(remoteMessage))
    })

    return unsubscribe
  }, [])

 return (
   <View style={styles.container}>
    <Text>{runTypeMessage}</Text>
    <Text>Testing after changing back to `production` channel and branch</Text>
    <Text>Adding another line before eas update</Text>
    <Text>Adding another line after eas update for Android testing</Text>
    <Text>Testing Native code changes</Text>
    <Text>This is new text added after the new build (post Native code changes)</Text>
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
       <Button testID='app-button-dummy' title='Dummy' onPress={(async() => alert('Hello from a new build!'))}/>
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

export default App