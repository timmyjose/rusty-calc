import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Main from './Main'
import AndroidKVBackupAgent from './components/AndroidKVBackupAgent'
import VersionNumberInfo from './components/VersionNumberInfo'
import DeviceInformation from './components/DeviceInformation'
import SecureStoreDemo from './components/SecureStoreDemo'
import { AppState } from 'react-native'
import { useEffect, useRef } from 'react'

export type RootStackParamsList = {
  Main: undefined
  Backup: undefined
  VersionNumberInfo: undefined
  DeviceInformation: undefined
  SecureStoreDemo: undefined
}

const Stack = createNativeStackNavigator<RootStackParamsList>()

function App() {
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App is now active and in the foreground')
      }

      appState.current = nextAppState
      console.log('AppState = ', appState.current)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Main' component={Main} />
        <Stack.Screen name='Backup' component={AndroidKVBackupAgent} />
        <Stack.Screen name='VersionNumberInfo' component={VersionNumberInfo} />
        <Stack.Screen name='DeviceInformation' component={DeviceInformation} />
        <Stack.Screen name='SecureStoreDemo' component={SecureStoreDemo} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
