import { NotificationPermission, useHasNotificationPermission, useRequestNotificationPermission } from './useNotificationPermission'
import { View, Button, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const GetPermissions = () => {
 const { hasPermission } = useHasNotificationPermission()
 console.log('GetPermissions] hasPermission = ', hasPermission)
 const requestNotificationPermission = useRequestNotificationPermission()
 const navigation = useNavigation()

 return (
   <View style={styles.container}>
   {hasPermission !== NotificationPermission.ENABLED && hasPermission != NotificationPermission.DENIED && (
     <Button title="Enable Notifications" onPress = {requestNotificationPermission.execute}/>
   )}
     <Button title="Go Back" onPress={() => navigation.goBack()} />
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


export default GetPermissions