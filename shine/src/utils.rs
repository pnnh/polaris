pub(crate) mod article;
pub(crate) mod env;

use crate::config;

pub fn get_photo_or_default(photo_path: &str) -> String {
    if !photo_path.is_empty() {
        if photo_path.starts_with("http://") || photo_path.starts_with("https://") {
            return photo_path.to_string();
        }
        let mut file_url = "".to_string();
        file_url.push_str(config::FILE_URL);
        file_url.push_str(photo_path);
        return file_url;
    }
    config::DEFAULT_FILE_URL.to_string()
}

fn capitalize_first_letter(s: &str) -> String {
    s[0..1].to_uppercase() + &s[1..]
}
