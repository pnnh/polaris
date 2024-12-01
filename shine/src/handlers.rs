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
use crate::handlers::jwt::{login_handler, register_handler};
use crate::views::graphql::schema::{graphql_mutation_handler, graphql_mutation_playground};
use crate::views::{html, restful};
use crate::{config, helpers, layers};

mod about; 
mod jwt;
mod sitemap;
mod user;

#[derive(Clone, Debug)]
pub struct State {
    pub registry: Handlebars<'static>,
    pub pool: layers::ConnectionPool,
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
    reg.register_helper("reslink", Box::new(helpers::SimpleHelper));

    register_template_file(&mut reg);

    let state = Arc::new(State {
        registry: reg,
        pool,
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
        .route("/article/read/:pk", get(html::article::article_read_handler))
        .route("/restful/articles", post(restful::article::article_create_handler))
        .route("/articles/:article_uri", get(html::article::article_read_handler))
        .route(
            "/graphql/mutation",
            if config::is_debug() {
                get(graphql_mutation_playground).post(graphql_mutation_handler)
            } else {
                post(graphql_mutation_handler)
            },
        )
        .route("/user/:pk", get(user::user_info_handler))
        .route("/seo/sitemap", get(sitemap::sitemap_handler))
        .route("/account/login", post(login_handler))
        .route("/account/register", get(register_handler))
        .route("/restful/index/query", get(restful::index::query))
        .layer(cors)
        .layer(middleware.into_inner())
}

fn register_template_file<'reg>(reg: &mut Handlebars) {
    reg.register_template_file("index", "assets/templates/pages/index.hbs")
        .unwrap();
    reg.register_template_file("about", "assets/templates/pages/about.hbs")
        .unwrap();
    reg.register_template_file("error", "assets/templates/pages/error.hbs")
        .unwrap();
    reg.register_template_file("styles", "assets/templates/partial/styles.hbs")
        .unwrap();
    reg.register_template_file("analytics", "assets/templates/partial/analytics.hbs")
        .unwrap();
    reg.register_template_file("footer", "assets/templates/partial/footer.hbs")
        .unwrap();
    reg.register_template_file("header", "assets/templates/partial/header.hbs")
        .unwrap();
    reg.register_template_file("headmeta", "assets/templates/partial/headmeta.hbs")
        .unwrap();
    reg.register_template_file("scripts", "assets/templates/partial/scripts.hbs")
        .unwrap();

    reg.register_template_file("article_read", "assets/templates/pages/article/read.hbs")
        .unwrap();
    reg.register_template_file("user_info", "assets/templates/pages/user/info.hbs")
        .unwrap();
    reg.register_template_file(
        "account_register",
        "assets/templates/pages/account/register.hbs",
    )
    .unwrap();
}
