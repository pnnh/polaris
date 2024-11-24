use std::io::{Cursor, Read, Seek, SeekFrom};
use std::sync::Arc;

use axum::response::Html;
use axum::{extract::Extension,};
use chrono::{TimeZone, Utc};

use crate::handlers::State;

use crate::models::error::OtherError;
use crate::views::restful::error::HttpRESTError;
use xml::writer::{EmitterConfig, XmlEvent};

pub async fn sitemap_handler<'a>(
    Extension(state): Extension<Arc<State>>,
) -> Result<Html<String>, HttpRESTError> {
    let conn = state
        .pool
        .get()
        .await
        .map_err(|err| OtherError::Unknown(err))?;

    let query_result = conn
        .query(
            "select articles.pk, articles.update_time
from articles
order by update_time desc;",
            &[],
        )
        .await
        .map_err(|err| OtherError::Unknown(err))?;

    let mut output = Cursor::new(Vec::new());
    let mut writer = EmitterConfig::new()
        .perform_indent(true)
        .create_writer(&mut output);
    writer
        .write(
            XmlEvent::start_element("urlset")
                .attr("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9"),
        )
        .map_err(|err| OtherError::Unknown(err))?;
    for row in query_result {
        let pk: &str = row.get("pk");
        let update_time: chrono::NaiveDateTime = row.get("update_time");
        let update_time_utc: chrono::DateTime<Utc> = Utc.from_utc_datetime(&update_time);
        let lastmod: String = update_time_utc.to_rfc3339();
        writer
            .write(XmlEvent::start_element("url"))
            .map_err(|err| OtherError::Unknown(err))?;

        writer
            .write(XmlEvent::start_element("loc"))
            .map_err(|err| OtherError::Unknown(err))?;
        writer
            .write(XmlEvent::characters(
                format!("https://sfx.xyz/article/read/{}", pk).as_str(),
            ))
            .map_err(|err| OtherError::Unknown(err))?;
        writer
            .write(XmlEvent::end_element())
            .map_err(|err| OtherError::Unknown(err))?;

        writer
            .write(XmlEvent::start_element("lastmod"))
            .map_err(|err| OtherError::Unknown(err))?;
        writer
            .write(XmlEvent::characters(lastmod.as_str()))
            .map_err(|err| OtherError::Unknown(err))?;
        writer
            .write(XmlEvent::end_element())
            .map_err(|err| OtherError::Unknown(err))?;

        writer
            .write(XmlEvent::end_element())
            .map_err(|err| OtherError::Unknown(err))?;
    }
    writer
        .write(XmlEvent::end_element())
        .map_err(|err| OtherError::Unknown(err))?;
    output.seek(SeekFrom::Start(0)).unwrap();
    let mut result = String::new();
    output
        .read_to_string(&mut result)
        .map_err(|err| OtherError::Unknown(err))?;

    Ok(Html(result))
}
