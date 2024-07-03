import { useNavigation } from '@react-navigation/native'
import { Alert, Button, Platform, Text, TextInput, View } from 'react-native'
import * as AndroidKVBackupAgent from 'android-kv-backup-agent'
import { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamsList } from '../App'

const PREFS_FILE = 'rustycalc_app_prefs'

export default function ApiKey() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamsList>>()

  const [backupKey, setBackupKey] = useState<string>('')
  const [backupValue, setBackupValue] = useState<string>('')
  const [restoreKey, setRestoreKey] = useState<string>('')

  const backupData = (key: string, value: string): void => {
    AndroidKVBackupAgent.backupData(PREFS_FILE, key, value)
  }

  const restoreData = (key: string): string => {
    return AndroidKVBackupAgent.restoreData(PREFS_FILE, key)
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      { Platform.OS === 'android' && (
        <>
          <Text>android:allowBackup : {AndroidKVBackupAgent.getAllowBackup()}</Text>
          <Text>android:backupAgent : {AndroidKVBackupAgent.getBackupAgent()}</Text>
          <TextInput
            value={backupKey}
            onChangeText={text => setBackupKey(text)}
            placeholder='Enter backup key'
          />
          <TextInput
            value={backupValue}
            onChangeText={text => setBackupValue(text)}
            placeholder='Enter backup value'
          />
          <Button title='Backup Data' onPress={() => {
            backupData(backupKey, backupValue)
          }}/>
          <TextInput
            value={restoreKey}
            onChangeText={text => setRestoreKey(text)}
            placeholder='Enter restore key'
          />
          <Button title='Restore data' onPress={() => {
            const value = restoreData(restoreKey)
            Alert.alert(`Restored data is key: ${restoreKey}, value: ${value}`)
          }}/>
        </>
      )}
      <Button title='Go Back' onPress={() => navigation.goBack()}/>
    </View>
  )
}
