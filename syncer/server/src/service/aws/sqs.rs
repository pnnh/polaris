use crate::models::error::{AppError, OtherError};
use aws_config::meta::region::RegionProviderChain;
use aws_sdk_sqs::{Client, Error, Region, PKG_VERSION};
use std::collections::HashMap;

pub const FILE_URL: &str = "https://file.sfx.xyz";
pub const DEFAULT_FILE_URL: &str = "https://res.sfx.xyz/images/default.png";

#[derive(Debug, Clone)]
pub struct AwsSqsService {
    client: Client
}

impl AwsSqsService {
    pub async fn init() -> Result<AwsSqsService, AppError> {
        let region_provider = RegionProviderChain::default_provider().or_else("ap-east-1");
        let config = aws_config::from_env().region(region_provider).load().await;

        let client = Client::new(&config);

        let service = AwsSqsService {
            client
        };
        Ok(service)
    }
 
    pub async fn send_receive(&self, body: String) -> Result<(), Error> {
        // todo 通过AppConfig配置而非写死。考虑生产和调试环境下使用不同的队列。
        let queue_url = "https://sqs.ap-east-1.amazonaws.com/809038661221/article_queue_uri_debug";
        let rsp = self.client
            .send_message()
            .queue_url(queue_url)
            //.message_body("hello from my queue")
            .message_body(body)
            //.message_group_id("MyGroup")
            .send()
            .await?;
    
        //println!("Response from sending a message: {:#?}", rsp);
    
        Ok(())
    }
}