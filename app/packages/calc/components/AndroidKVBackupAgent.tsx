import { useNavigation } from '@react-navigation/native'
import { Button, Platform, Text, View } from "react-native"
import * as AndroidKVBackupAgent from 'android-kv-backup-agent'

export default function ApiKey() {
  const navigation = useNavigation()

  return (
    <View style={{flex: 1, alignItems:'center', justifyContent: 'center'}}>
      { Platform.OS === 'android' && (
        <>
          <Text>android:allowBackup : {AndroidKVBackupAgent.getAllowBackup()}</Text>
          <Text>android:backupAgent : {AndroidKVBackupAgent.getBackupAgent()}</Text>
        </>
      )}
      <Button title='Go Back' onPress={() => navigation.goBack()}/>
    </View>
  )
}