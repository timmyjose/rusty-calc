import { useEffect, useState } from "react"
import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import { Button, View, Text, StyleSheet, Platform } from "react-native"
import notifee, { AndroidImportance, RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native'

export type Payload = {
  title: string;
  body: string;
}

export async function displayNotification(payload: Payload) {
  // Request permissions (required for iOS, and Android >= API 33)
  await notifee.requestPermission()
 
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'local-notifications-channel',
    name: 'Local Notifications Channel',
    importance: AndroidImportance.HIGH
  });
 
  // Display a notification
  await notifee.displayNotification({
    title: payload.title,
    body: payload.body,
    android: {
      channelId,
      pressAction: {
        id: 'local-notifcations-channel'
      }
    }
  })
 }

const BACKGROUND_FETCH_TASK = 'rusty-calc-background-fetch'

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  let notificationMessage;
  if (Platform.OS === 'ios') {
    notificationMessage = `[iOS] got background fetch call at date: ${new Date(now).toISOString()}`
  } else {
    notificationMessage = `[Android] got background fetch call at date: ${new Date(now).toISOString()}`
  }

  console.log(notificationMessage)

  // trigger a local notification using `notifee`
  displayNotification({
    title: 'Background fetch call',
    body:  `At time ${new Date(now).toISOString()}`
  })

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData
})

export default function BackgroundFetchScreen() {
    const [isRegistered, setIsRegistered] = useState(false)
    const [status, setStatus] = useState<BackgroundFetch.BackgroundFetchStatus | null>(null)
  
    useEffect(() => {
      checkStatusAsync()
    }, [])
  
  // 2. Register the task at some point in your app by providing the same name,
  // and some configuration options for how the background fetch should behave
  // Note: This does NOT need to be in the global scope and CAN be used in your React components!
  async function registerBackgroundFetchAsync() {
    if (Platform.OS === 'ios') {
      console.log('[iOS] Registered background task')
      return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 15 // 15 minutes, which is the minimum for iOS
      })
    }

    // Android
    console.log('[Android] Registered background task')
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 1, // 1 minute
      stopOnTerminate: false, // only for Android
      startOnBoot: true // only for Android
    })
  }
  
  // 3. (Optional) Unregister tasks by specifying the task name
  // This will cancel any future background fetch calls that match the given name
  // Note: This does NOT need to be in the global scope and CAN be used in your React components!
  async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  }
  
  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync()
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)
    setStatus(status)
    setIsRegistered(isRegistered)
  };
 
  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync()
    } else {
      await registerBackgroundFetchAsync()
    }
 
    checkStatusAsync()
  };
 
  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text>
          Background fetch status:{' '}
          <Text style={styles.boldText}>
            {status && BackgroundFetch.BackgroundFetchStatus[status]}
          </Text>
        </Text>
        <Text>
          Background fetch task name:{' '}
          <Text style={styles.boldText}>
            {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
          </Text>
        </Text>
      </View>
      <View style={styles.textContainer}></View>
      <Button
        title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
        onPress={toggleFetchTask}
      />
    </View>
  )
 }

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
})
