package expo.modules.androidkvbackupagent

import android.app.backup.BackupAgentHelper
import android.app.backup.SharedPreferencesBackupHelper

const val PREFS = "rustycalc_app_prefs"
const val PREFS_BACKUP_KEY = "rustycalc_app_prefs_backup_key"

class RustyCalcBackupAgent : BackupAgentHelper() {
    override fun onCreate() {
        SharedPreferencesBackupHelper(this, PREFS).also {
            addHelper(PREFS_BACKUP_KEY, it)
        }
    }
}
