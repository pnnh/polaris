use std::path::PathBuf;
use std::{env, fs};

fn main() {
    println!("Build on {}", env::consts::OS);

    println!(r"cargo:rustc-link-search=C:\Projects\Multiverse\build\windows\quantum\Debug");

    cxx_build::bridge("src/lib.rs")
        .file("src/blobstore.cc")
        .file("src/concat.cc")
        .std("c++20")
        .compile("quantum");

    println!("cargo:rerun-if-changed=src/lib.rs");
    println!("cargo:rerun-if-changed=src/blobstore.cc");
    println!("cargo:rerun-if-changed=include/blobstore.h");

    copy_file().unwrap();
}

// 把Rust依赖的C++动态库文件从CMake生成目录拷贝到rust运行目录，避免运行时找不到动态库
fn copy_file() -> Result<(), Box<dyn std::error::Error>> {
    let current_dir = env::current_dir()?;
    println!(
        "Entries modified in the last 24 hours in {:?}:",
        current_dir
    );

    let mut current_dir_string = current_dir.clone().into_os_string();
    if (env::consts::OS == "macos") {
        current_dir_string.push("/../build/macos/quantum/Debug");
    } else if (env::consts::OS == "linux") {
        current_dir_string.push("/../build/linux/quantum/Debug");
    } else if (env::consts::OS == "windows") {
        current_dir_string.push("/../build/windows/quantum/Debug");
    }
    let solardir: PathBuf = std::path::PathBuf::from(current_dir_string);
    println!("solardir {:?}", solardir);

    for entry in fs::read_dir(solardir)? {
        let entry = entry?;
        let path = entry.path();

        let file_name = path.file_name().unwrap_or_default();
        let ext = path.extension().unwrap_or_default();

        let current_dir_string = path.clone().into_os_string();
        println!(
            "current_dir_string {:?} {}",
            current_dir_string,
            ext.to_str().unwrap_or_default()
        );

        let mut target_path_string = current_dir.clone().into_os_string();
        target_path_string
            .push("/../target/debug/".to_owned() + file_name.to_str().unwrap_or_default());
        println!(
            "target_path_string {}",
            target_path_string.clone().to_str().unwrap_or_default()
        );
        let target_path = PathBuf::from(target_path_string);

        let ext_str = ext.to_str().unwrap_or_default();
        if (ext_str == "dll"
            || ext_str == "lib"
            || ext_str == "a"
            || ext_str == "so"
            || ext_str == "dylib")
        {
            fs::copy(path, target_path.clone().into_os_string())?;
        }
    }

    Ok(())
}
