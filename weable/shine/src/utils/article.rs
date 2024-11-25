
use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TocItem {
    pub title: String,
    pub header: i32,
}

pub fn build_body(toc_box: &mut Vec<TocItem>, nodes: &serde_json::Value) -> Result<String, String> {
    let children = nodes["children"]
        .as_array()
        .ok_or_else(|| "children未定义")?;

    let mut body_html_builder = string_builder::Builder::default();

    for child in children {
        let content = build_node(toc_box, &child).or_else(|err| Err(err.to_string()))?;
        body_html_builder.append(content);
    }
    match body_html_builder.string() {
        Ok(v) => Ok(v),
        Err(err) => Err(err.to_string()),
    }
}

fn build_node(toc_box: &mut Vec<TocItem>, node: &serde_json::Value) -> Result<String, String> {
    let name = node["name"].as_str().ok_or_else(|| "未找到name属性")?;
    match name {
        "paragraph" => Ok(build_paragraph(node)?),
        "header" => Ok(build_header(toc_box, node)?),
        "code-block" => Ok(build_code_block(node)?),
        _ => Err("undefined".to_string()),
    }
}

fn build_header(toc_list: &mut Vec<TocItem>, node: &serde_json::Value) -> Result<String, String> {
    let header = node["header"].as_i64().ok_or_else(|| "未找到header属性")?;

    let children = node["children"]
        .as_array()
        .ok_or_else(|| "header children未定义")?;
    let mut header_text: String = "".to_string();

    for child in children {
        let content = build_header_text(&child).or_else(|err| Err(err.to_string()))?;
        header_text.push_str(content.as_str());
        toc_list.push(TocItem {
            title: header_text.to_string(),
            header: header as i32,
        })
    }
    let header_html = format!(
        "<h{} id='{}'>{}</h{}>",
        header, header_text, header_text, header
    );

    Ok(header_html)
}

fn build_paragraph(node: &serde_json::Value) -> Result<String, String> {
    let children = node["children"]
        .as_array()
        .ok_or_else(|| "paragraph children未定义")?;

    let mut children_html_builder = string_builder::Builder::default();
    children_html_builder.append("<p class='fx-paragraph'>");
    for child in children {
        let content = build_text(&child).or_else(|err| Err(err.to_string()))?;
        children_html_builder.append(content.replace("\n", "<br/>"));
    }
    children_html_builder.append("</p>");
    match children_html_builder.string() {
        Ok(v) => Ok(v),
        Err(err) => Err(err.to_string()),
    }
}

fn build_code_block(node: &serde_json::Value) -> Result<String, String> {
    let children = node["children"]
        .as_array()
        .ok_or_else(|| "code-block children 未定义")?;
    let language = node["language"]
        .as_str()
        .ok_or_else(|| "code-block language 未定义")?;

    let mut children_html_builder = string_builder::Builder::default();
    children_html_builder.append(format!("<pre><code class='{}'>", language));
    for child in children {
        let content = build_code_text(&child).or_else(|err| Err(err.to_string()))?;
        children_html_builder.append(content);
    }
    children_html_builder.append("</code></pre>");
    match children_html_builder.string() {
        Ok(v) => Ok(v),
        Err(err) => Err(err.to_string()),
    }
}

fn build_code_text(node: &serde_json::Value) -> Result<String, String> {
    let text = node["text"].as_str().ok_or_else(|| "未找到text属性")?;

    let text_html = html_escape::encode_text(text);

    Ok(format!("{}", text_html))
}

fn build_text(node: &serde_json::Value) -> Result<String, String> {
    let text = node["text"].as_str().ok_or_else(|| "未找到text属性")?;

    let text_html = html_escape::encode_text(text);
    let mut text_decoration: String = "".to_string();
    let mut class_name: String = "".to_string();

    text_decoration.push_str(node["strike"].as_str().map_or("", |_| "line-through"));
    class_name.push_str(node["bold"].as_str().map_or("", |_| "fx-bold"));
    class_name.push_str(node["italic"].as_str().map_or("", |_| "fx-italic"));
    text_decoration.push_str(node["underline"].as_str().map_or("", |_| "underline"));
    class_name.push_str(node["code"].as_str().map_or("", |_| "fx-code"));

    let mut property: String = "".to_string();
    if !class_name.is_empty() {
        property = format!(" class='{}'", class_name);
    }
    if !text_decoration.is_empty() {
        property.push_str(format!(" style='text-decoration:{}'", text_decoration).as_str());
    }

    Ok(format!("<span {}>{}</span>", property, text_html))
}

fn build_header_text(node: &serde_json::Value) -> Result<String, String> {
    let text = node["text"].as_str().ok_or_else(|| "未找到text属性")?;

    Ok(html_escape::encode_text(text).to_string())
}
