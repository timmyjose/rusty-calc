package expo.modules.androidkvbackupagent

import android.app.backup.BackupAgentHelper
import android.app.backup.SharedPreferencesBackupHelper

// the actual preferences file containing the key-value pairs
// used by the app
const val PREFS = "rustycalc_app_prefs"

// used by Android's Backup Agent internally to uniquely identify 
// the preferences file
const val PREFS_BACKUP_KEY = "rustycalc_app_prefs_backup_key"

class RustyCalcBackupAgent : BackupAgentHelper() {
    override fun onCreate() {
        SharedPreferencesBackupHelper(this, PREFS).also {
            addHelper(PREFS_BACKUP_KEY, it)
        }
    }
}
