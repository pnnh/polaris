
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


pub fn add(left: u64, right: u64) -> u64 {
    println!("Hello, world!");
    let client = ffi::new_blobstore_client();
    let concatenated = ffi::concat(ffi::ConcatRequest {
        fst: "fearless".to_owned(),
        snd: "concurrency".to_owned(),
    });
    println!("concatenated: {:?}", concatenated);

    let new_length = unsafe { list_file(10) };
    println!("new_length: {:?}", new_length);

    left + right
}