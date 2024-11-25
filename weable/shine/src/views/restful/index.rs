use std::sync::Arc;

use axum::extract::Query;
use axum::{extract::Extension, Json};
use serde::{Deserialize, Serialize};

use crate::handlers::State;
use crate::models::error::{AppError, };
use crate::models::index::IndexModel;
use crate::service::index::IndexService;
use crate::views::restful::error::HttpRESTError;


const INDEX_PAGE_SIZE: i32 = 10;

#[derive(Deserialize)]
pub struct IndexIn {
    p: Option<i32>,
}

#[derive(Serialize)]
pub struct IndexOut {
    models: Vec<IndexModel>,
}

pub async fn query(
    Query(args): Query<IndexIn>,
    Extension(state): Extension<Arc<State>>,
) -> Result<Json<IndexOut>, HttpRESTError> {
    let mut current_page = args.p.unwrap_or(1);
    tracing::debug!("current_page:{}", current_page,);
    if current_page < 1 {
        return Err(HttpRESTError::from(AppError::InvalidParameter));
    }

    let row_count = 17;
    let mut max_page = row_count / INDEX_PAGE_SIZE;
    if row_count % INDEX_PAGE_SIZE != 0 {
        max_page += 1;
    }
    if current_page > max_page {
        current_page = max_page;
    }

    let offset: i64 = ((current_page - 1) * INDEX_PAGE_SIZE) as i64;
    let limit: i64 = INDEX_PAGE_SIZE as i64;

    let index_service = IndexService::new(state.clone());

    let models = index_service.query(offset, limit).await?;

    let out = IndexOut { models };

    Ok(Json(out))
}
