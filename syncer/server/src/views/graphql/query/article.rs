use async_graphql::{Context, Object, Result};
use std::sync::Arc;

use crate::handlers::State;
use crate::service::article::ArticleService;
use crate::views::graphql::types::Article;

#[derive(Default)]
pub struct ArticleQuery;

#[Object]
impl ArticleQuery {
    async fn articles(&self, ctx: &Context<'_>, offset: i32, limit: i32) -> Result<Vec<Article>> {
        let state = ctx.data::<Arc<State>>().unwrap();

        let offset_value: i64 = if offset < 0 { 0 } else { offset as i64 };
        let limit_value: i64 = if limit < 4 || limit > 64 {
            8
        } else {
            limit as i64
        };

        let article_service = ArticleService::new(state.clone());

        let articles = article_service
            .query_articles(offset_value, limit_value)
            .await?;

        let mut result: Vec<Article> = Vec::new();

        for art in articles {
            let model = Article { title: art.title };
            result.push(model);
        }

        Ok(result)
    }

    async fn articles_count(&self, ctx: &Context<'_>) -> Result<i32> {
        let state = ctx.data::<Arc<State>>().unwrap();
        let article_service = ArticleService::new(state.clone());

        let count = article_service.query_count().await?;

        Ok(count as i32)
    }
}
