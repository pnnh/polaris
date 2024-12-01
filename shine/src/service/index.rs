use std::sync::Arc;

use crate::handlers::State;
use crate::models::error::{AppError, OtherError};
use crate::models::index::IndexModel;

pub struct IndexService {
    state: Arc<State>,
}

impl IndexService {
    pub fn new(state: Arc<State>) -> IndexService {
        IndexService { state }
    }

    pub async fn query(&self, offset: i64, limit: i64) -> Result<Vec<IndexModel>, AppError> {
        let conn = self
            .state
            .pool
            .get()
            .await
            .map_err(|err| OtherError::BB8Postgres(err))?;

        let query_result = conn
            .query(
                "select articles.pk, articles.title,  
articles.description, articles.update_time, articles.creator, articles.keywords, articles.mark_lang,
articles.uri, accounts.nickname, accounts.uri as creator_uri
from articles left join accounts on articles.creator = accounts.pk
where articles.status = 1
order by update_time desc offset $1 limit $2;",
                &[&offset, &limit],
            )
            .await
            .map_err(|err| AppError::Postgresql(err))?;

        let mut models: Vec<IndexModel> = Vec::new();

        for row in query_result {
            let pk: &str = row.get("pk");
            let title: &str = row.get("title");
            //let body: serde_json::Value = row.get("body");
            let description: Option<&str> = row.get("description");
            let update_time: chrono::NaiveDateTime = row.get("update_time");
            let creator: String = row.get("creator");
            let keywords: Option<&str> = row.get("keywords");
            let creator_nickname: Option<&str> = row.get("nickname");
            //let views: Option<i64> = row.get("views");
            let mark_lang: Option<i32> = row.get("mark_lang");
            let uri: Option<&str> = row.get("uri");
            let creator_uri: Option<&str> = row.get("creator_uri");

            let model = IndexModel {
                pk: pk.to_string(),
                title: title.to_string(),
                description: description.unwrap_or("").to_string(),
                creator: creator.to_string(),
                creator_nickname: creator_nickname.unwrap_or("").to_string(),
                views: 0,   //views.unwrap_or(0),
                keywords: keywords.unwrap_or("").to_string(),
                update_time: update_time,
                mark_lang: mark_lang.unwrap_or(0),
                uri: uri.unwrap_or("").to_string(),
                creator_uri: creator_uri.unwrap_or("").to_string(),
            };
            models.push(model);
        }
        Ok(models)
    }

    pub async fn query_count(&self) -> Result<i64, AppError> {
        let conn = self
            .state
            .pool
            .get()
            .await
            .expect("index articles获取pool出错");

        let query_result = conn
            .query("select count(*) from articles where status = 1;", &[])
            .await
            .expect("index count执行查询出错");

        for row in query_result {
            let count: i64 = row.get(0);
            return Ok(count as i64);
        }

        Err(AppError::EmptyData)
    }
}
