import ExpoModulesCore

public class AndroidKVBackupAgentModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AndroidKVBackupAgent")

    Function("getAllowBackup") { () -> String in 
      "unsupported"
    }

    Function("getBackupAgent") { () -> String in 
        "unsupported"
    }
  }
}
