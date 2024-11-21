use crate::handlers::State;
use crate::models::claims::Claims;
use crate::models::error::{AppError, OtherError};
use crate::utils::chinese_to_pinyin;
use async_graphql::{Context, InputObject, Object, Result};
use chrono::Utc;
use nanoid::nanoid;
use serde::{Serialize};
use std::sync::Arc;

#[derive(InputObject, Debug)]
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

#[Object]
impl ArticleMutation {
    pub async fn create_article(
        &self,
        ctx: &Context<'_>,
        input: CreateArticleInput,
    ) -> Result<CreateBody> {
        tracing::debug!("create_post {:?}", input);
        let state = ctx.data::<Arc<State>>().unwrap();
        let auth = ctx
            .data::<Option<Claims>>()
            .map_err(|err| OtherError::Unknown(err))?;
        if auth.is_none() {
            return Err(async_graphql::Error::from(AppError::InvalidToken));
        }

        let conn = state
            .pool
            .get()
            .await
            .map_err(|err| OtherError::Unknown(err))?;

        let pk = nanoid!();
        let article_body = ArticleBody {
            children: input.body,
        };
        let publish = if input.publish { 1 } else { 0 };
        let naive_date_time = Utc::now().naive_utc();
        let claims = auth.clone().unwrap();
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
        let template = 1;
        let hans_pinyin = chinese_to_pinyin(input.title.as_str());
        conn.execute(
            "insert into articles(pk, title, body, create_time, update_time, creator, 
                keywords, description, status, template, uri)
    values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);",
            &[
                &pk,
                &input.title,
                &postgres_types::Json::<ArticleBody>(article_body),
                &naive_date_time,
                &naive_date_time,
                &claims.user,
                &keywords,
                &description,
                &publish,
                &template,
                &hans_pinyin,
            ],
        )
        .await
        .map_err(|err| AppError::Postgresql(err))?;

        let result = CreateBody { pk: pk };
        Ok(result)
    }
}
