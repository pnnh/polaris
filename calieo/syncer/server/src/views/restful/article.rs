use crate::handlers::State;
use crate::models::claims::{Claims, Keys};
use crate::models::error::{AppError, OtherError};
use crate::utils::chinese_to_pinyin;
use async_graphql::{Context, InputObject, Object, Result};
use axum::{TypedHeader, headers};
use axum::headers::Authorization;
use axum::headers::authorization::Bearer;
use chrono::Utc;
use jsonwebtoken::{decode, Validation};
use nanoid::nanoid;
use serde::{Serialize, Deserialize};
use std::sync::Arc;
 
use crate::views::restful::error::HttpRESTError;
use axum::{extract::Extension, Json}; 

#[derive(Debug, Deserialize)]
pub struct CreateArticleInput {
    title: String,
    body: String,
    publish: bool,
    keywords: Option<String>,
    description: Option<String>,
}

#[derive(Debug, Serialize)]
pub(crate) struct ArticleBody {
    children: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct CreateBody {
    pk: String,
}

#[Object]
impl CreateBody {
    async fn pk(&self) -> String {
        self.pk.clone()
    }
}

#[derive(Default)]
pub struct ArticleMutation;

pub async fn article_create_handler(
    claims: Claims, 
    Json(input): Json<CreateArticleInput>,
    Extension(state): Extension<Arc<State>>, 
) -> Result<Json<CreateBody>, HttpRESTError> {
      
    tracing::debug!("article_create_handler {:?}", input);  

    let conn = state
        .pool
        .get()
        .await
        .map_err(|err| OtherError::Unknown(err))?;

    let pk = nanoid!();
    // let article_body = ArticleBody {
    //     children: input.body,
    // };
    let publish = if input.publish { 1 } else { 0 };
    let naive_date_time = Utc::now().naive_utc(); 
    let keywords = if let Some(v) = input.keywords {
        v
    } else {
        "".to_string()
    };
    let description = if let Some(v) = input.description {
        v
    } else {
        "".to_string()
    };
    let mark_lang = 1;      // markdown
    let mark_text = input.body;
    //let hans_pinyin = chinese_to_pinyin(input.title.as_str());
    conn.execute(
        "insert into articles(pk, title, create_time, update_time, creator, 
            keywords, description, status, mark_lang, mark_text, uri)
values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
        &[
            &pk,
            &input.title,
            //&postgres_types::Json::<ArticleBody>(article_body),
            &naive_date_time,
            &naive_date_time,
            &claims.user,
            &keywords,
            &description,
            &publish,
            &mark_lang,
            &mark_text,
            //&hans_pinyin,
        ],
    )
    .await
    .map_err(|err| AppError::Postgresql(err))?;

    let result = CreateBody { pk: pk };
    // let result = CreateBody { pk: "".to_string() };
    Ok(Json(result))
}
 