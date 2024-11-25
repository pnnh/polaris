use crate::models::error::{AppError, OtherError};
use std::env;
use std::fmt::Debug;
use std::str::FromStr;

pub trait IntValue: FromStr {}

impl IntValue for u16 {}
impl IntValue for u32 {}
impl IntValue for u64 {}

pub fn read_env<T>(name: &str) -> Result<T, AppError>
where
    T: FromStr,
    <T as FromStr>::Err: Debug,
{
    match env::var(name) {
        Ok(val) => match val.parse::<T>() {
            Ok(int_val) => Ok(int_val),
            Err(err) => Err(AppError::from(OtherError::Unknown(err))),
        },
        Err(err) => Err(AppError::Unknown(err.to_string())),
    }
}
