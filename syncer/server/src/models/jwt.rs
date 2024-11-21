use std::sync::Arc;

use async_trait::async_trait;
use axum::extract::{FromRequest, RequestParts};
use axum::headers::authorization::Bearer;
use axum::headers::Authorization;
use axum::{Extension, TypedHeader};
use jsonwebtoken::{decode, Validation};
use serde::{Deserialize, Serialize};

use crate::handlers::State;
use crate::models::claims::{Keys};
use crate::models::error::{OtherError};
use crate::views::restful::error::HttpRESTError;

#[derive(Debug, Serialize, Deserialize, Clone, Copy, Default)]
pub struct Protected {
    // pub(crate) sub: String,
    // pub(crate) company: String,
    pub(crate) exp: usize,
}

#[async_trait]
impl<B> FromRequest<B> for Protected
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
            decode::<Protected>(bearer.token(), &jwt_keys.decoding, &Validation::default())
                .map_err(|err| OtherError::Unknown(err))?;

        Ok(token_data.claims)
    }
}

// fn json_content_type<B>(req: &RequestParts<B>) -> bool {
//     let content_type = if let Some(content_type) = req.headers().get(header::CONTENT_TYPE) {
//         content_type
//     } else {
//         return false;
//     };

//     let content_type = if let Ok(content_type) = content_type.to_str() {
//         content_type
//     } else {
//         return false;
//     };

//     let mime = if let Ok(mime) = content_type.parse::<mime::Mime>() {
//         mime
//     } else {
//         return false;
//     };

//     let is_json_content_type = mime.type_() == "application"
//         && (mime.subtype() == "json" || mime.suffix().map_or(false, |name| name == "json"));

//     is_json_content_type
// }
