use crate::handlers::State;
use crate::models::article::ArticleModel;
use crate::models::error::AppError;
use std::sync::Arc;

pub struct ArticleService {
    state: Arc<State>,
}

impl ArticleService {
    pub fn new(state: Arc<State>) -> ArticleService {
        ArticleService { state }
    }

    pub async fn query_articles(
        &self,
        offset: i64,
        limit: i64,
    ) -> Result<Vec<ArticleModel>, AppError> {
        let offset_value: i64 = if offset < 0 { 0 } else { offset as i64 };
        let limit_value: i64 = if limit < 4 || limit > 64 {
            8
        } else {
            limit as i64
        };

        let conn = self
            .state
            .pool
            .get()
            .await
            .expect("graphql articles获取pool出错");

        let query_result = conn
            .query(
                "select articles.pk, articles.title, articles.body, 
articles.description, articles.update_time, articles.creator, articles.keywords,
accounts.nickname, articles_views.views
from articles
    left join accounts on articles.creator = accounts.pk
	left join articles_views on articles.pk = articles_views.pk
where articles.status = 1
order by update_time desc offset $1 limit $2;",
                &[&offset_value, &limit_value],
            )
            .await
            .expect("graphql articles执行查询出错");

        let mut result: Vec<ArticleModel> = Vec::new();

        for row in query_result {
            let pk: &str = row.get("pk");
            let title: &str = row.get("title");

            let model = ArticleModel {
                pk: pk.to_string(),
                title: title.to_string(),
            };
            result.push(model);
        }

        Ok(result)
    }

    pub async fn query_count(&self) -> Result<i64, AppError> {
        let conn = self
            .state
            .pool
            .get()
            .await
            .expect("graphql articles获取pool出错");

        let query_result = conn
            .query("select count(*) from articles where status = 1;", &[])
            .await
            .expect("graphql count执行查询出错");

        for row in query_result {
            let count: i64 = row.get(0);
            return Ok(count as i64);
        }

        Err(AppError::EmptyData)
    }
}
