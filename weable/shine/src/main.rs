use crate::utils::env::read_env;
use std::env;
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod handlers;
mod helpers;
mod layers;
mod models;
mod service;
mod utils;
mod views;

#[tokio::main]
async fn main() {
    println!("Hello, world from Rust!");
    let args: Vec<String> = env::args().collect();
    println!("{:?}", args);
    let port = read_env::<u16>("PORT").unwrap_or(8080);
    println!("port: {:?}", port);

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::debug!("listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(handlers::app().await.into_make_service())
        .await
        .unwrap();
}
