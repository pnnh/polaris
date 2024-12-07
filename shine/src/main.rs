use crate::utils::env::read_env;
use std::env;
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod handlers;
mod helpers;
mod models;
mod utils;
mod views;

use libc::size_t;

extern crate libc;

#[link(name = "MTQuantum", kind = "dylib")]
extern {
    fn list_file(input: libc::c_int) -> libc::c_int;
}

#[cxx::bridge]
mod ffi {
    struct ConcatRequest {
        fst: String,
        snd: String,
    }

    unsafe extern "C++" {
        include!("shine/include/blobstore.h");
        include!("shine/include/concat.h");

        type BlobstoreClient;

        fn new_blobstore_client() -> UniquePtr<BlobstoreClient>;
        fn concat(r: ConcatRequest) -> String;
    }
}


#[tokio::main]
async fn main() {


    println!("Hello, world!");
    let client = ffi::new_blobstore_client();
    let concatenated = ffi::concat(ffi::ConcatRequest {
        fst: "fearless".to_owned(),
        snd: "concurrency".to_owned(),
    });
    println!("concatenated: {:?}", concatenated);
    
    
    println!("Hello, world from Rust!");
    let args: Vec<String> = env::args().collect();
    println!("{:?}", args);
    let port = read_env::<u16>("PORT").unwrap_or(8080);
    println!("port: {:?}", port);
    
    let new_length = unsafe { list_file(10) };
    println!("new_length: {:?}", new_length);

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
