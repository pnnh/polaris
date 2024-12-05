use std::sync::Arc;

use axum::http::Method;
use axum::{ routing::get, routing::post, Router};
use bb8::Pool;
use bb8_postgres::PostgresConnectionManager;
use handlebars::Handlebars;
use tokio_postgres::NoTls;
use tower::ServiceBuilder;
use tower_http::cors::{Any, CorsLayer};
use tower_http::ServiceBuilderExt;

use crate::config::{is_debug, ProximaConfig};
use crate::views::{html, restful};

mod about;

#[derive(Clone, Debug)]
pub struct State {
    pub registry: Handlebars<'static>,
    pub config: ProximaConfig,
}

pub async fn app() -> Router {
    let config = ProximaConfig::init().await.expect("初始化配置出错");

    let dsn_env: &str = config.dsn.as_str();

    let manager = PostgresConnectionManager::new_from_stringlike(dsn_env, NoTls).unwrap();
    let pool = Pool::builder().build(manager).await.unwrap();

    let mut reg = Handlebars::new();
    if is_debug() {
        reg.set_dev_mode(true);
    }

    let state = Arc::new(State {
        registry: reg,
        config,
    });

    let cors = CorsLayer::new()
        // allow `GET` and `POST` when accessing the resource
        .allow_methods(vec![Method::GET, Method::POST])
        // allow requests from any origin
        .allow_origin(Any)
        .allow_headers(Any);

    let middleware = ServiceBuilder::new().add_extension(state.clone());

    Router::new()
        .route("/", get(html::index::index_handler))
        .route("/about", get(about::about_handler))
        .route("/restful/index/query", get(restful::index::query))
        .layer(cors)
        .layer(middleware.into_inner())
}
