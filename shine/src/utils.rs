pub(crate) mod article;
pub(crate) mod env;

use pinyin::{ToPinyin};
use jieba_rs::Jieba;

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

pub fn chinese_to_pinyin(hans: &str) -> String {
    let jieba = Jieba::new();
    let words = jieba.cut(hans, true);
    //print!("=={:?}==\n", words);

    let mut pinyin_string = "".to_string();
    for w in words {
        //print!("--{:?}--\n", w);
        let mut is_chinese = false;
        for pinyin in w.to_pinyin() {
            if let Some(p) = pinyin {
                //print!("=={}==\n", p.plain());
                pinyin_string = pinyin_string +  p.plain() + " ";
                is_chinese = true;
            } 
        } 
        if is_chinese {
            continue;
        }
        let trimed_word = w.trim();
        if trimed_word.is_empty() {
            continue;
        }
        let first_char = trimed_word.chars().next().unwrap();
        if !first_char.is_digit(10) && !first_char.is_alphabetic() {
            continue;
        }
        //print!("=={}=={}==2\n", w, w.trim().is_empty()); 
        pinyin_string = pinyin_string + w + " ";
    }

    let hans_pinyin = pinyin_string.trim_end().replace(" ", "-");
 
    //println!("pinyin_string: {}", hans_pinyin);

    hans_pinyin
}