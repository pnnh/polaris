use axum::{
    async_trait,
    extract::{Extension, FromRequest, RequestParts},
};
use bb8::{Pool, PooledConnection};
use bb8_postgres::PostgresConnectionManager;
use tokio_postgres::NoTls;

pub type ConnectionPool = Pool<PostgresConnectionManager<NoTls>>;

struct DatabaseConnection(PooledConnection<'static, PostgresConnectionManager<NoTls>>);

use crate::models::error::{ OtherError};
use crate::views::restful::error::HttpRESTError;

#[async_trait]
impl<B> FromRequest<B> for DatabaseConnection
where
    B: Send,
{
    type Rejection = HttpRESTError;

    async fn from_request(req: &mut RequestParts<B>) -> Result<Self, Self::Rejection> {
        let Extension(pool) = Extension::<ConnectionPool>::from_request(req)
            .await
            .map_err(|err| OtherError::Unknown(err))?;

        let conn = pool
            .get_owned()
            .await
            .map_err(|err| OtherError::Unknown(err))?;

        Ok(Self(conn))
    }
}
