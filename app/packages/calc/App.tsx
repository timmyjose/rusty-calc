/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react'
import { View, TextInput, Button, Text, StyleSheet, StatusBar, Platform } from 'react-native'
import { execute } from 'react-native-rust-bridge'
import * as Updates from 'expo-updates'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function requestPermissionsAsync() { 
  return await Notifications.requestPermissionsAsync({ 
    ios: { 
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true
     }
  }) 
} 

async function allowsNotificationsAsync() {
  let settings;

  if (Platform.OS === 'ios') {
    settings = await requestPermissionsAsync()
  } else {
    settings = await Notifications.getPermissionsAsync()
  }
  return (
    settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  )
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig?.extra?.eas.projectId})).data
    console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  return token
}

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

  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response)
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [])

 return (
   <View style={styles.container}>
    <Text>{runTypeMessage}</Text>
    <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification()
        }}
      />
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