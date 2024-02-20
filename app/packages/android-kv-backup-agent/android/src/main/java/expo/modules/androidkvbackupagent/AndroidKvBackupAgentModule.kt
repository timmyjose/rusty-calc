package expo.modules.androidkvbackupagent

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.pm.PackageManager
import android.content.pm.ApplicationInfo 
import android.content.Context
import android.content.SharedPreferences
import androidx.core.os.bundleOf

class AndroidKVBackupAgentModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AndroidKVBackupAgent")

    Events("onKeyValueBackup")

    Function("getAllowBackup") {
      val packageName = appContext.reactContext?.packageName.toString()
      val packageInfo = appContext.reactContext?.packageManager?.getPackageInfo(packageName, PackageManager.GET_META_DATA)
      val allowBackup = ((packageInfo?.applicationInfo?.flags ?: 0) and ApplicationInfo.FLAG_ALLOW_BACKUP) != 0

      return@Function allowBackup.toString()
    }

    Function("getBackupAgent") { 
      val packageName = appContext.reactContext?.packageName.toString()
      val applicationInfo = appContext.reactContext?.packageManager?.getApplicationInfo(packageName, PackageManager.GET_META_DATA)
      val backupAgent = applicationInfo?.backupAgentName?.trim()

      return@Function backupAgent
    }

    // Save the key-value pair in the given SharedPreferences file (creating it if it doesn't exist)
    Function("backupData") { prefsFile: String, key: String, value: String -> 
      // backup to the preferences file
      getSharedPreferences(prefsFile).edit().putString(key, value).commit() // sync

      // send an event about backup
      this@AndroidKVBackupAgentModule.sendEvent("onKeyValueBackup", bundleOf(key to key))
    }

    // retrieve the value for the given key from the given SharedPreferences file
    Function("restoreData") { prefsFile: String, key: String -> 
      return@Function getSharedPreferences(prefsFile).getString(key, "not-found")
    }
  }

   // helpers
    private val context
    get() = requireNotNull(appContext.reactContext)

    private fun getSharedPreferences(prefsFile: String): SharedPreferences {
      return context.getSharedPreferences(prefsFile, Context.MODE_PRIVATE)
    }
}
