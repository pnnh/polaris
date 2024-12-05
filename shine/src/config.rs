use crate::models::error::{AppError, OtherError};
use std::collections::HashMap;

pub const FILE_URL: &str = "https://file.sfx.xyz";
pub const DEFAULT_FILE_URL: &str = "https://res.sfx.xyz/images/default.png";

#[derive(Debug, Clone)]
pub struct ProximaConfig {
    pub dsn: String,
    pub totp_secret: String,
    pub jwt_secret: String, 
}

impl ProximaConfig {
    pub async fn init() -> Result<ProximaConfig, AppError> {
        let content = String::from("DSN=postgres://postgres:postgres@localhost:5432/proxima\nTOTP_SECRET=JBSWY3DPEHPK3PXP\nJWT"); 
        ProximaConfig::parse_config(content)
    }

    pub fn parse_config(configuration: String) -> Result<ProximaConfig, AppError> {
        let config = ProximaConfig {
            dsn: "".to_string(),
            totp_secret: "".to_string(),
            jwt_secret: "".to_string(), 
        };
        Ok(config)
    }

    pub fn blog_url(path: &str) -> String {
        // if is_debug() {
        //     return format!("http://code.sfx.xyz:3500{}", path)
        // }
        // 通过Api Gateway使blog站点在同一域名下，所以不再需要分别判断
        return path.to_string()
    }
}

pub fn mode() -> String {
    let machine_kind = if cfg!(debug_assertions) {
        "debug"
    } else {
        "release"
    };
    machine_kind.to_string()
}

pub fn is_debug() -> bool {
    mode() == "debug"
}
