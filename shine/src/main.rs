use crate::utils::env::read_env;
use std::{env, fs};
use std::net::SocketAddr;
use std::path::PathBuf;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod handlers;
mod helpers;
mod models;
mod utils;
mod views;

#[tokio::main]
async fn main() {

    let num = 10;
    println!("Hello, world! {num} plus one is {}!", shine::add(num, num));



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
    
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();

    let app = handlers::app().await;
    axum::serve(listener, app)
        .await
        .unwrap();
}
