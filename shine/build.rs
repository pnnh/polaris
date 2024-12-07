use std::{env, fs};
use std::path::PathBuf;

fn main() {
    println!(r"cargo:rustc-link-search=C:\Projects\Multiverse\build\windows\quantum\Debug");

    cxx_build::bridge("src/main.rs")
        .file("src/blobstore.cc")
        .file("src/concat.cc")
        .std("c++20")
        .compile("shine");

    println!("cargo:rerun-if-changed=src/main.rs");
    println!("cargo:rerun-if-changed=src/blobstore.cc");
    println!("cargo:rerun-if-changed=include/blobstore.h");

    // let current_dir = env::current_dir()?;
    // println!(
    //     "Entries modified in the last 24 hours in {:?}:",
    //     current_dir
    // );
    // let mut current_dir_string = current_dir.clone().into_os_string();
    // let new_string = current_dir_string.push("../build");
    // let solardir:PathBuf = new_string.into();
    // println!(
    //     "Entries solardir {:?}:",
    //     solardir
    // );
    //
    // for entry in fs::read_dir(current_dir) {
    //     let entry = entry?;
    //     let path = entry.path();
    //
    //     let metadata = fs::metadata(&path)?;
    //     let last_modified = metadata.modified()?.elapsed()?.as_secs();
    //
    //     if last_modified < 24 * 3600 && metadata.is_file() {
    //         println!(
    //             "Last modified: {:?} seconds, is read only: {:?}, size: {:?} bytes, filename: {:?}",
    //             last_modified,
    //             metadata.permissions().readonly(),
    //             metadata.len(),
    //             path.file_name().ok_or("No filename")?
    //         );
    //     }
    // }
}