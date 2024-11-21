
use axum::response::{Html,};
use axum::{extract::Extension, extract::Path, };
use serde_json::json;
use std::collections::HashMap;
use std::sync::Arc;

use crate::handlers::State;
use crate::models::error::{AppError, OtherError};
use crate::utils::article::{build_body, TocItem};
use crate::views::restful::error::HttpRESTError;

pub async fn article_read_handler(
    Path(params): Path<HashMap<String, String>>,
    Extension(state): Extension<Arc<State>>,
) -> Result<Html<String>, HttpRESTError> {
    let pk = params.get("article_uri").ok_or_else(|| AppError::InvalidData)?;
    tracing::debug!("pk:{}", pk,);

    let conn = state
        .pool
        .get()
        .await
        .map_err(|err| OtherError::BB8Postgres(err))?;

    let query_result = conn
        .query(
            "select articles.pk, articles.title, articles.body, 
articles.description, articles.update_time, articles.creator, articles.keywords,
accounts.nickname, accounts.email, accounts.description, accounts.photo, 
    accounts.create_time as accounts_create_time,
articles_views.views
from articles
left join accounts on articles.creator = accounts.pk
left join articles_views on articles.pk = articles_views.pk
where articles.pk = $1 or articles.uri = $1;",
            &[&pk],
        )
        .await
        .map_err(|err| AppError::Postgresql(err))?;

    if query_result.len() < 1 {
        return Err(HttpRESTError::from(AppError::NotFound));
    }

    let title: &str = query_result[0].get("title");
    let body: serde_json::Value = query_result[0].get("body");
    let description: &str = query_result[0].get("description");
    let update_time: chrono::NaiveDateTime = query_result[0].get("update_time");
    //let creator: String = query_result[0].get("creator");
    let keywords: String = query_result[0].get("keywords");
    let views: Option<i64> = query_result[0].get("views");
    // let creator_nickname: &str = query_result[0].get("nickname");
    // let creator_email: Option<&str> = query_result[0].get("email");
    // let creator_description: Option<&str> = query_result[0].get("description");
    // let creator_photo: Option<&str> = query_result[0].get("photo");
    // let creator_create_time: chrono::NaiveDateTime = query_result[0].get("accounts_create_time");

    let mut toc_list: Vec<TocItem> = Vec::new();
    toc_list.push(TocItem {
        title: title.to_string(),
        header: 0,
    });
    let body_html =
        build_body(&mut toc_list, &body).or_else(|err| Err(OtherError::Unknown(err)))?;

    let page_data = &json!({
        "pk": pk.to_string(),
        "title": title.to_string(),
        "body_html": body_html,
        "description": description.to_string(),
        "update_time_formatted": update_time.format("%Y年%m月%d日 %H:%M").to_string(),
        // "creator": {
        //     "pk": creator,
        //     "email": creator_email.unwrap_or(""),
        //     "description": creator_description.unwrap_or(""),
        //     "nickname": creator_nickname.to_string(),
        //     "photo": utils::get_photo_or_default(creator_photo.unwrap_or("")),
        //     "create_time": creator_create_time.format("%Y年%m月%d日 %H:%M").to_string(),
        // },
        "views": views.unwrap_or(0),
        "keywords": keywords,
        "toc_list": toc_list,
    });
    //println!("page_data: {:?}", page_data);

    let result = state
        .registry
        .render("article_read", page_data)
        .map_err(|err| AppError::Handlebars(err))?;

    Ok(Html(result))
}
