use crate::models::error::{AppError, OtherError};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;
use std::fmt::{Debug, Display, Formatter};

#[derive(Debug)]
pub struct HttpRESTError {
    pub status: StatusCode,
    pub message: String,
}

impl HttpRESTError {
    pub fn new(message: &str) -> HttpRESTError {
        HttpRESTError {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: message.to_string(),
        }
    }
    // pub fn from_string(message: String) -> HttpRESTError {
    //     HttpRESTError {
    //         status: StatusCode::INTERNAL_SERVER_ERROR,
    //         message,
    //     }
    // }
}

impl Display for HttpRESTError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "proxima error: {}", self.message)
    }
}

impl<T> From<OtherError<T>> for HttpRESTError
where
    T: Debug,
{
    fn from(error: OtherError<T>) -> Self {
        HttpRESTError::new(error.to_string().as_str())
    }
}

impl From<AppError> for HttpRESTError {
    fn from(error: AppError) -> Self {
        match error {
            //WrongCredentials => HttpRESTError::new("授权有误"),
            _ => HttpRESTError::new(format!("未知REST错误: {}", error.to_string()).as_str()),
        }
    }
}

impl IntoResponse for HttpRESTError {
    fn into_response(self) -> Response {
        let body = Json(json!({
            "error": self.message,
        }));
        (self.status, body).into_response()
    }
}
