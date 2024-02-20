import ExpoModulesCore

public class AndroidKVBackupAgentModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AndroidKVBackupAgent")

    Events("onKeyValueBackup")

    Function("getAllowBackup") { () -> String in 
      "unsupported"
    }

    Function("getBackupAgent") { () -> String in 
        "unsupported"
    }

    Function("backupData") { (prefsFile: String, key: String, value: String ) -> Void in
      // do nothing
    }

    Function("restoreData") { (prefsFile: String) -> String in 
      "unsupported"
    }
  }
}
