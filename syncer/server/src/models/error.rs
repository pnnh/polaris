
use std::{error};
use std::fmt::{Debug, Display, Formatter};

pub enum AppError {
    WrongCredentials,
    MissingCredentials,
    //TokenCreation,
    InvalidData,
    InvalidToken,
    InvalidParameter,
    NotFound,
    EmptyData,
    InvalidConfig(&'static str),
    //Graphql(async_graphql::Error),
    Postgresql(tokio_postgres::Error),
    Handlebars(handlebars::RenderError),
    Unknown(String),
}

impl Display for AppError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl Debug for AppError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::WrongCredentials => write!(f, "错误凭证"),
            Self::MissingCredentials => write!(f, "缺少凭证"),
            //Self::TokenCreation => write!(f, "Token创建错误"), 
            Self::InvalidData => write!(f, "无效数据"),
            Self::InvalidToken => write!(f, "无效Token"),
            Self::InvalidParameter => write!(f, "无效参数"),
            Self::NotFound => write!(f, "未找到"),
            Self::EmptyData => write!(f, "数据为空"),
            Self::InvalidConfig(msg) => write!(f, "{}", msg),
            //Self::Graphql(msg) => write!(f, "Graphql相关错误: {}", msg.message),
            Self::Postgresql(msg) => write!(f, "Postgresql相关错误: {}", msg),
            Self::Handlebars(msg) => write!(f, "Handlebars相关错误: {}", msg),
            Self::Unknown(msg) => write!(f, "未知错误: {}", msg), 
            //_ => write!(f, "未知错误"),
        }
    }
}

impl<T> From<OtherError<T>> for AppError
where
    T: Debug,
{
    fn from(error: OtherError<T>) -> Self {
        AppError::Unknown(error.to_string())
    }
}

#[derive(Debug)]
pub enum OtherError<T>
where
    T: Debug,
{
    BB8Postgres(bb8::RunError<T>),
    Unknown(T),
}

impl<T> Display for OtherError<T>
where
    T: Debug,
{
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl<T> std::error::Error for OtherError<T>
where
    T: error::Error + 'static,
{
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            Self::Unknown(inner) => Some(inner),
            _ => None,
        }
    }
}

impl<T> From<T> for OtherError<T>
where
    T: error::Error,
{
    fn from(error: T) -> Self {
        Self::Unknown(error)
    }
}
