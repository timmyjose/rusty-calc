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

pub(crate) async fn abs(x: f64) -> f64 {
    x.abs()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_add() {
        assert_eq!(15.0, add(12.0, 3.0).await);
    }

    #[tokio::test]
    async fn test_sub() {
        assert_eq!(9.0, sub(12.0, 3.0).await);
    }

    #[tokio::test]
    async fn test_mul() {
        assert_eq!(36.0, mul(12.0, 3.0).await);
    }

    #[tokio::test]
    async fn test_div() {
        assert_eq!(4.0, div(12.0, 3.0).await);
    }

    #[tokio::test]
    async fn test_abs() {
        assert_eq!(10.0, abs(-10.0).await);
        assert_eq!(10.0, abs(10.0).await);
        assert_eq!(0.0, abs(0.0).await);
    }
}
