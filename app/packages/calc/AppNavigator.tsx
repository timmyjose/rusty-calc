import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './Main';
import GetPermissions from './GetPermissions';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Main} />
      <Stack.Screen name="GetPermissions" component={GetPermissions} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
