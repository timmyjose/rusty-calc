use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::{
    ffi::{c_char, CStr, CString},
    sync::Arc,
};
use tokio::runtime::{Builder, Runtime};

mod calc;

use std::sync::Mutex;

lazy_static! {
    pub static ref RUNTIME: Arc<Runtime> =
        Arc::new(Builder::new_multi_thread().enable_all().build().unwrap());
}

#[derive(Deserialize)]
pub enum Command {
    Add { x: f64, y: f64 },
    Sub { x: f64, y: f64 },
    Mul { x: f64, y: f64 },
    Div { x: f64, y: f64 },
    Abs { x: f64 },
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

        let result = execute_cmd(cmd).await;
        let res_str =
            serde_json::to_string(&result).expect("failed to serialize command execution result");
        CString::new(res_str.as_bytes()).unwrap().into_raw()
    })
}

async fn execute_cmd(cmd: Command) -> CommandResult {
    match cmd {
        Command::Add { x, y } => {
            let sum = calc::add(x, y).await;

            CommandResult {
                res: sum,
                operation: "addition".to_string(),
            }
        }

        Command::Sub { x, y } => {
            let diff = calc::sub(x, y).await;
            CommandResult {
                res: diff,
                operation: "subtraction".to_string(),
            }
        }

        Command::Mul { x, y } => {
            let prod = calc::mul(x, y).await;
            CommandResult {
                res: prod,
                operation: "multiplication".to_string(),
            }
        }

        Command::Div { x, y } => {
            let quot = calc::div(x, y).await;
            CommandResult {
                res: quot,
                operation: "division".to_string(),
            }
        }

        Command::Abs { x } => {
            let abs_res = calc::abs(x).await;
            CommandResult {
                res: abs_res,
                operation: "abs".to_string(),
            }
        }
    }
}
