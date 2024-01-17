pub(crate) async fn add(x: f64, y: f64) -> f64 {
    x + y
}

pub(crate) async fn sub(x: f64, y: f64) -> f64 {
    x - y
}

pub(crate) async fn mul(x: f64, y: f64) -> f64 {
    x * y
}

pub(crate) async fn div(x: f64, y: f64) -> f64 {
    if y == 0.0f64 {
        y
    } else {
        x / y
    }
}
