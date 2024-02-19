import AndroidKVBackupAgentModule from "./AndroidKVBackupAgentModule"

export function getAllowBackup(): string {
    return AndroidKVBackupAgentModule.getAllowBackup()
}

export function getBackupAgent(): string {
    return AndroidKVBackupAgentModule.getBackupAgent()
}