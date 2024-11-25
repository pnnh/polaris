use crate::models::error::{AppError, OtherError};
use aws_config::meta::region::RegionProviderChain;
use aws_sdk_appconfig::Client;
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
        let region_provider = RegionProviderChain::default_provider().or_else("ap-east-1");
        let config = aws_config::from_env().region(region_provider).load().await;

        let client = Client::new(&config);

        let mut request = client
            .get_configuration()
            .client_id("proxima")
            .application("sfx");
        if is_debug() {
            request = request.configuration("debug.config").environment("debug");
        } else {
            request = request
                .configuration("release.config")
                .environment("release");
        };
        let response = request
            .send()
            .await
            .map_err(|err| OtherError::Unknown(err))?;

        if let Some(blob) = response.content() {
            let data = blob.clone().into_inner();
            let content = String::from_utf8(data).map_err(|err| OtherError::Unknown(err))?;
            // todo 生产环境移除掉
            // tracing::info!("appconfig: {}", content);
            return ProximaConfig::parse_config(&content);
        }
        Err(AppError::EmptyData)
    }

    pub fn parse_config(configuration: &String) -> Result<ProximaConfig, AppError> {
        let split = configuration.split("\n");
        let mut config_map: HashMap<String, String> = HashMap::new();

        let mut config = ProximaConfig {
            dsn: "".to_string(),
            totp_secret: "".to_string(),
            jwt_secret: "".to_string(), 
        };
        
        for s in split {
            let index = s.find("=").unwrap_or(0);
            if index > 0 {
                config_map.insert(s[..index].to_string(), s[index + 1..].to_string());
                let key = s[..index].to_string();
                let value = s[index + 1..].to_string();
                match key.as_str() {
                    "DSN" => config.dsn = value,
                    "TOTP_SECRET" => config.totp_secret = value,
                    "JWT_KEY" => config.jwt_secret = value,
                    _ => {}
                }
            }
        }
        if config.dsn.is_empty() {
            return Err(AppError::InvalidConfig("未配置DSN"));
        }
        if config.totp_secret.is_empty() {
            return Err(AppError::InvalidConfig("未配置TOTP_SECRET"));
        }
        if config.jwt_secret.is_empty() {
            return Err(AppError::InvalidConfig("未配置JWT_SECRET"));
        }
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
