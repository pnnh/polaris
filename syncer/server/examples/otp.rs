use std::time::SystemTime;

use totp_rs::{Algorithm, TOTP};

fn main() {
    let totp = TOTP::new(
        Algorithm::SHA1,
        6,
        1,
        30,
        "supersecret",
        Some("dream".to_string()),
        "linyangz@sfx.xyz".to_string(),
    )
    .unwrap();
    let token = totp.generate_current().unwrap();
    println!("{}", token);

    if let Ok(v) = totp.check_current(token.as_str()) {
        println!("check_current: {}", v);
    }

    let url = totp.get_url();
    println!("{}", url);
    let code = totp.get_qr().unwrap();
    println!("{}", code);
}
