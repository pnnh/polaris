use std::fmt::Display;
use std::sync::Arc;

use async_trait::async_trait;
use axum::extract::{FromRequest, RequestParts};
use axum::headers::authorization::Bearer;
use axum::headers::Authorization;
use axum::{Extension, TypedHeader};
use jsonwebtoken::{decode, DecodingKey, EncodingKey, Validation};
use serde::{Deserialize, Serialize};

use crate::handlers::State;
use crate::models::error::{OtherError};
use crate::views::restful::error::HttpRESTError;

pub struct Keys {
    pub(crate) encoding: EncodingKey,
    pub(crate) decoding: DecodingKey,
}

impl Keys {
    pub fn new(secret: &[u8]) -> Self {
        Self {
            encoding: EncodingKey::from_secret(secret),
            decoding: DecodingKey::from_secret(secret),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct Claims {
    // pub(crate) sub: String,
    // pub(crate) company: String,
    pub(crate) exp: usize,
    pub(crate) user: String,
}

#[derive(Debug, Serialize)]
pub struct AuthBody {
    access_token: String,
    token_type: String,
}

impl AuthBody {
    pub(crate) fn new(access_token: String) -> Self {
        Self {
            access_token,
            token_type: "Bearer".to_string(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct AuthPayload {
    pub(crate) account: String,
    pub(crate) code: String,
}

#[async_trait]
impl<B> FromRequest<B> for Claims
where
    B: Send,
{
    type Rejection = HttpRESTError;

    async fn from_request(req: &mut RequestParts<B>) -> Result<Self, Self::Rejection> {
        // Extract the token from the authorization header
        let TypedHeader(Authorization(bearer)) =
            TypedHeader::<Authorization<Bearer>>::from_request(req)
                .await
                .map_err(|err| OtherError::Unknown(err))?;
        // Decode the user data
        type Extractors = Extension<Arc<State>>;

        let Extension(state) = Extractors::from_request(req)
            .await
            .map_err(|err| OtherError::Unknown(err))?;

        let jwt_keys = Keys::new(&state.config.jwt_secret.as_bytes());
        let token_data =
            decode::<Claims>(bearer.token(), &jwt_keys.decoding, &Validation::default())
                .map_err(|err| OtherError::Unknown(err))?;

        Ok(token_data.claims)
    }
}

impl Display for Claims {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Email: {}", self.exp)
    }
}
