use std::collections::HashMap;
use std::sync::Arc;

use axum::response::Html;
use axum::{extract::Extension, extract::Path,};
use serde_json::json;

use crate::handlers::State;
use crate::models::error::{AppError, OtherError};
use crate::views::restful::error::HttpRESTError;
use crate::{utils};

pub async fn user_info_handler<'a>(
    Path(params): Path<HashMap<String, String>>,
    Extension(state): Extension<Arc<State>>,
) -> Result<Html<String>, HttpRESTError> {
    let pk = params.get("pk").ok_or_else(|| AppError::InvalidParameter)?;
    tracing::debug!("pk:{}", pk,);

    let conn = state
        .pool
        .get()
        .await
        .map_err(|err| OtherError::Unknown(err))?;

    let query_result = conn
        .query(
            "select accounts.nickname, accounts.email, accounts.description, accounts.photo, 
accounts.create_time, accounts.site
from accounts
where accounts.pk = $1;",
            &[&pk],
        )
        .await
        .map_err(|err| OtherError::Unknown(err))?;

    if query_result.len() < 1 {
        return Err(HttpRESTError::new("用户未找到"));
    }

    let nickname: &str = query_result[0].get("nickname");
    let email: &str = query_result[0].get("email");
    let description: &str = query_result[0].get("description");
    let photo: &str = query_result[0].get("photo");
    let site: &str = query_result[0].get("site");
    let create_time: chrono::NaiveDateTime = query_result[0].get("create_time");

    let page_data = &json!({
        "pk": pk,
        "email": email.to_string(),
        "description": description.to_string(),
        "nickname": nickname.to_string(),
        "site": site.to_string(),
        "photo": utils::get_photo_or_default(photo),
        "create_time": create_time.format("%Y年%m月%d日 %H:%M").to_string(),
    });
    //println!("page_data: {:?}", page_data);

    let result = state
        .registry
        .render("user_info", page_data)
        .map_err(|err| OtherError::Unknown(err))?;

    Ok(Html(result))
}
