import AndroidKVBackupAgentModule from './AndroidKVBackupAgentModule'

export function getAllowBackup(): string {
  return AndroidKVBackupAgentModule.getAllowBackup()
}

export function getBackupAgent(): string {
  return AndroidKVBackupAgentModule.getBackupAgent()
}

// set up event subscriptions so that we can backup/retrieve key-value
// pairs to and from the shared preferences file without having to exit
// the app
// const emitter = new EventEmitter(AndroidKVBackupAgentModule)

// export type KeyValueBackupEvent = {
//     key: string;
//     value: string;
// }

// export function addKeyValueBackupListener(listener: (event: KeyValueBackupEvent) => void): Subscription {
//     return emitter.addListener<KeyValueBackupEvent>('onKeyValueBackup', listener)
// }

export function backupData(prefsFile: string, key: string, value: string): void {
  AndroidKVBackupAgentModule.backupData(prefsFile, key, value)
}

export function restoreData(prefsFile: string, key: string): string {
  return AndroidKVBackupAgentModule.restoreData(prefsFile, key)
}
