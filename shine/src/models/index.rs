
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

impl IndexModel {
    pub fn new() -> IndexModel {
        IndexModel {
            pk: "".to_string(),
            title: "".to_string(),
            creator: "".to_string(),
            creator_uri: "".to_string(),
            keywords: "".to_string(),
            description: "".to_string(),
            creator_nickname: "".to_string(),
            views: 0,
            mark_lang: 0,
            update_time: chrono::NaiveDateTime::from_timestamp(0, 0),
            uri: "".to_string(),
        }
    }
}