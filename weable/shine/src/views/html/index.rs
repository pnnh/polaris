 
 
use std::sync::Arc;

use axum::extract::Query;
use axum::response::Html;
use axum::{extract::Extension, };
use serde_json::json;

use crate::config::ProximaConfig;
use crate::handlers::State;
use crate::models::error::{AppError,  };
use crate::models::index::IndexModel;
use crate::service::index::IndexService;
use crate::views::restful::error::HttpRESTError;
use crate::{helpers,  };
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
            view.read_url = path;   //ProximaConfig::blog_url(path.as_str());
        } else {
            view.read_url = format!("/articles/{}", article_uri);
        }
        view
    }
}


pub async fn index_handler<'a>(
    Query(args): Query<IndexQuery>,
    Extension(state): Extension<Arc<State>>,
) -> Result<Html<String>, HttpRESTError> {
    let mut current_page = args.p.unwrap_or(1);
    tracing::debug!("current_page:{}", current_page,);
    if current_page < 1 {
        return Err(HttpRESTError::from(AppError::InvalidParameter));
    }

    let index_service = IndexService::new(state.clone());
    let count = index_service.query_count().await?;

    let row_count = count as i32;
    let mut max_page = row_count / INDEX_PAGE_SIZE;
    if row_count % INDEX_PAGE_SIZE != 0 {
        max_page += 1;
    }
    if current_page > max_page {
        current_page = max_page;
    }

    let offset: i64 = ((current_page - 1) * INDEX_PAGE_SIZE) as i64;
    let limit: i64 = INDEX_PAGE_SIZE as i64;

    let models = index_service.query(offset, limit).await?;

    let mut views: Vec<IndexView> = Vec::new();

    for m in models {
        let view = IndexView::from_model(m);
        views.push(view);
    }

    let pages_html = helpers::calc_page_html(max_page, current_page);
    let result = state
        .registry
        .render(
            "index",
            &json!({ "models": views, "pages_html": pages_html }),
        )
        .map_err(|err| AppError::Handlebars(err))?;

    Ok(Html(result))
}
