use cfg_if::cfg_if;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::{
    ffi::{c_char, CStr, CString},
    sync::Arc,
};
use tokio::runtime::{Builder, Runtime};

mod calc;

cfg_if! {
    if #[cfg(target_os = "android")] {
        use android_logger::Config;
        use log::LevelFilter;

        fn init_android_logger() {
            android_logger::init_once(
                Config::default()
                    .with_max_level(LevelFilter::Debug)
                    .with_tag("Calc"),
            );

            log::info!("Initialised Android Logger for Calc");
        }

        lazy_static! {
            static ref ANDROID_LOGGER_INIT: () = init_android_logger();
        }
    } else if #[cfg(target_os = "ios")] {
        use log::LevelFilter;
        use oslog::OsLogger;

        fn init_ios_logger() {
          OsLogger::new("com.timmyjose.calc")
            .level_filter(LevelFilter::Debug)
            .category_level_filter("Settings", LevelFilter::Trace)
            .init()
            .unwrap();

            log::info!("Initialised iOS Logger for Calc");
        }

        lazy_static! {
            static ref IOS_LOGGER_INIT: () = init_ios_logger();
        }
    }
}

lazy_static! {
    pub static ref RUNTIME: Arc<Runtime> =
        Arc::new(Builder::new_multi_thread().enable_all().build().unwrap());
}

#[derive(Debug, Deserialize)]
pub enum Command {
    Add { x: f64, y: f64 },
    Sub { x: f64, y: f64 },
    Mul { x: f64, y: f64 },
    Div { x: f64, y: f64 },
}

#[derive(Serialize)]
pub struct CommandResult {
    pub res: f64,
    pub operation: String,
}

#[no_mangle]
#[allow(clippy::not_unsafe_ptr_arg_deref)]
pub extern "C" fn rust_execute(raw_cmd: *const c_char) -> *const c_char {
    RUNTIME.block_on(async move {
        let cmd = unsafe {
            let cmd_str = CStr::from_ptr(raw_cmd).to_str().unwrap();
            serde_json::from_str::<Command>(cmd_str)
                .expect("failed to extract Command from raw command string")
        };

        log::warn!("[RustBridge] Got cmd: {:?}", cmd);
        let result = execute_cmd(cmd).await;
        let res_str =
            serde_json::to_string(&result).expect("failed to serialize command execution result");
        CString::new(res_str.as_bytes()).unwrap().into_raw()
    })
}

async fn execute_cmd(cmd: Command) -> CommandResult {
    log::info!("About to execute command: {cmd:?}");
    match cmd {
        Command::Add { x, y } => {
            log::info!("Performing addition");
            let sum = calc::add(x, y).await;

            CommandResult {
                res: sum,
                operation: "addition".to_string(),
            }
        }

        Command::Sub { x, y } => {
            log::info!("Performing subtraction");
            let diff = calc::sub(x, y).await;
            CommandResult {
                res: diff,
                operation: "subtraction".to_string(),
            }
        }

        Command::Mul { x, y } => {
            log::info!("Performing multiplication");
            let prod = calc::mul(x, y).await;
            CommandResult {
                res: prod,
                operation: "multiplication".to_string(),
            }
        }
        Command::Div { x, y } => {
            log::info!("Performing division");
            let quot = calc::div(x, y).await;
            CommandResult {
                res: quot,
                operation: "division".to_string(),
            }
        }
    }
}
