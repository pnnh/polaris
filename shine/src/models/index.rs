
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct IndexModel {
    pub pk: String,
    pub title: String,
    pub creator: String,
    pub creator_uri: String,
    pub keywords: String,
    pub description: String,
    pub creator_nickname: String,
    pub views: i64,
    pub mark_lang: i32,
    pub update_time: chrono::NaiveDateTime,
    pub uri: String,
}
