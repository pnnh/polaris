use crate::config::is_debug;
use handlebars::{
    Context, Handlebars, Helper, HelperDef, HelperResult, JsonRender, Output, RenderContext,
};
use string_builder::Builder;

#[derive(Clone, Copy)]
pub struct SimpleHelper;

impl HelperDef for SimpleHelper {
    fn call<'reg: 'rc, 'rc>(
        &self,
        h: &Helper,
        _: &Handlebars,
        _: &Context,
        _: &mut RenderContext,
        out: &mut dyn Output,
    ) -> HelperResult {
        let param = h.param(0).unwrap();
        let release_path = if let Some(v) = h.param(1) {
            v.render()
        } else {
            "".to_string()
        };

        let res_url = if is_debug() {
            //"http://code.sfx.xyz:3600"
            ""      // 通过Api Gateway的形式使资源和主站在同一个域名下
        } else {
            //"https://res.sfx.xyz"
            ""      // 通过Api Gateway的形式使资源和主站在同一个域名下
        };
        out.write(res_url)?;
        if is_debug() || release_path.is_empty() {
            out.write(param.value().render().as_ref())?;
        } else {
            out.write(release_path.as_str())?;
        }
        Ok(())
    }
}

pub fn calc_page_html(max_page: i32, current_page: i32) -> String {
    let mut start_page = current_page - 5;
    let mut end_page = current_page + 5;

    if start_page < 1 {
        start_page = 1;
    }
    if end_page > max_page {
        end_page = max_page
    }
    let prev_page = current_page - 1;
    let next_page = current_page + 1;
    let mut pages_html_builder = Builder::default();

    if prev_page >= 1 {
        let prev_page_html = format!("<a class='page' href='/?p={}'>«</a>", prev_page);
        pages_html_builder.append(prev_page_html);
    }
    for n in start_page..=end_page {
        let mut class_active = "";
        if n == current_page {
            class_active = "active";
        }
        let page_html = format!(
            "<a class='page {}' href='/?p={}'>{}</a>",
            class_active, n, n
        );
        pages_html_builder.append(page_html);
    }
    if next_page <= max_page {
        let next_page_html = format!("<a class='page' href='/?p={}'>»</a>", next_page);
        pages_html_builder.append(next_page_html);
    }
    match pages_html_builder.string() {
        Ok(v) => v,
        Err(err) => {
            tracing::warn!("pages_html_builder error: {}", err);
            "".to_string()
        }
    }
}
