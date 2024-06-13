import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Main from './Main'
import AndroidKVBackupAgent from './components/AndroidKVBackupAgent'
import VersionNumberInfo from './components/VersionNumberInfo'
import EmulatorCheck from './components/EmulatorCheck'

const Stack = createNativeStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Main' component={Main} />
        <Stack.Screen name='Backup' component={AndroidKVBackupAgent} />
        <Stack.Screen name='VersionNumberInfo' component={VersionNumberInfo} />
        <Stack.Screen name='EmulatorCheck' component={EmulatorCheck} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
