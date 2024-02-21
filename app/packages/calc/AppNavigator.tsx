import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Main from './Main'
import CloudStore from './CloudStore'

const Stack = createNativeStackNavigator()

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={Main} />
      <Stack.Screen name='CloudStore' component={CloudStore}/>
    </Stack.Navigator>
  )
}

export default AppNavigator