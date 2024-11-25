use async_graphql::Object;

#[derive(Debug, Clone)]
pub struct Article {
    pub title: String,
}

#[Object]
impl Article {
    async fn title(&self) -> String {
        self.title.clone()
    }
}
