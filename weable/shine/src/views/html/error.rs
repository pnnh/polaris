use crate::models::error::{AppError, OtherError};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;
use std::fmt::{Debug, Display, Formatter};

#[derive(Debug)]
pub struct HttpHTMLError {
    pub status: StatusCode,
    pub message: String,
}

impl HttpHTMLError {
    pub fn new(message: &str) -> HttpHTMLError {
        HttpHTMLError {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: message.to_string(),
        }
    }
    // pub fn from_string(message: String) -> HttpHTMLError {
    //     HttpHTMLError {
    //         status: StatusCode::INTERNAL_SERVER_ERROR,
    //         message,
    //     }
    // }
}

impl Display for HttpHTMLError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "proxima error: {}", self.message)
    }
}

impl<T> From<OtherError<T>> for HttpHTMLError
where
    T: Debug,
{
    fn from(error: OtherError<T>) -> Self {
        HttpHTMLError::new(error.to_string().as_str())
    }
}

impl From<AppError> for HttpHTMLError {
    fn from(error: AppError) -> Self {
        match error {
            //WrongCredentials => HttpHTMLError::new("授权有误"),
            _ =>  HttpHTMLError::new("未知HTML ERROR"),
        }
    }
}

impl IntoResponse for HttpHTMLError {
    fn into_response(self) -> Response {
        // todo 怎么能渲染友好的html内容提示呢？
        let body = Json(json!({
            "error": self.message,
        }));
        (self.status, body).into_response()
    }
}
