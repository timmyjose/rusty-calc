package expo.modules.androidkvbackupagent

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.pm.PackageManager
import android.content.pm.ApplicationInfo 

class AndroidKVBackupAgentModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AndroidKVBackupAgent")

    Function("getAllowBackup") {
      val packageName = appContext.reactContext?.packageName.toString()
      val packageInfo = appContext.reactContext?.packageManager?.getPackageInfo(packageName, 0)
      val allowBackup = ((packageInfo?.applicationInfo?.flags ?: 0) and ApplicationInfo.FLAG_ALLOW_BACKUP) != 0

      return@Function allowBackup.toString()
    }

    Function("getBackupAgent") { 
      val packageName = appContext.reactContext?.packageName.toString()
      val applicationInfo = appContext.reactContext?.packageManager?.getApplicationInfo(packageName, PackageManager.GET_META_DATA)
      val backupAgent = applicationInfo?.backupAgentName?.trim()

      return@Function backupAgent
    }
  }
}
