use std::sync::Arc;

use axum::extract::Query;
use axum::response::Html;
use serde_json::json;

use crate::config::ProximaConfig;
use crate::handlers::State;
use crate::helpers;
use crate::models::error::{AppError, OtherError};
use crate::models::index::IndexModel;
use crate::views::restful::error::HttpRESTError;
use crate::views::restful::index::IndexOut;
use axum::{extract::Extension, Json};
use serde::{Deserialize, Serialize};

const INDEX_PAGE_SIZE: i32 = 10;

#[derive(Deserialize)]
pub struct IndexQuery {
    p: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct IndexView {
    pub pk: String,
    pub title: String,
    pub creator: String,
    pub keywords: String,
    pub description: String,
    pub update_time_formatted: String,
    pub creator_nickname: String,
    pub views: i64,
    pub read_url: String,
    pub uri: String,
}

impl IndexView {
    fn from_model(model: IndexModel) -> IndexView {
        let mut view = IndexView {
            pk: model.pk,
            title: model.title,
            description: model.description,
            update_time_formatted: model.update_time.format("%Y年%m月%d日 %H:%M").to_string(),
            creator: model.creator,
            creator_nickname: model.creator_nickname,
            views: model.views,
            keywords: model.keywords,
            read_url: "".to_string(),
            uri: model.uri,
        };
        let article_uri = if view.uri.trim().is_empty() {
            view.pk.clone()
        } else {
            view.uri.trim().to_string()
        };
        if model.mark_lang == 1 {
            let path = format!("/blog/articles/{}", article_uri);
            view.read_url = path; //ProximaConfig::blog_url(path.as_str());
        } else {
            view.read_url = format!("/articles/{}", article_uri);
        }
        view
    }
}

pub async fn index_handler<'a>(
    Query(args): Query<IndexQuery>,
    Extension(state): Extension<Arc<State>>,
) -> Result<axum::Json<IndexOut>, HttpRESTError> {
    let mut current_page = args.p.unwrap_or(1);
    tracing::debug!("current_page:{}", current_page,);
    if current_page < 1 {
        return Err(HttpRESTError::from(AppError::InvalidParameter));
    }

    let count = 22;

    let row_count = count as i32;
    let mut max_page = row_count / INDEX_PAGE_SIZE;
    if row_count % INDEX_PAGE_SIZE != 0 {
        max_page += 1;
    }
    if current_page > max_page {
        current_page = max_page;
    }

    let models = vec![IndexModel::new()];

    let out = IndexOut { models };

    Ok(Json(out))
}
