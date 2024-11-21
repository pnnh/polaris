pub(crate) mod article;

pub use article::ArticleMutation;

// Add your other ones here to create a unified Mutation object
// e.x. Mutation(PostMutation, OtherMutation, OtherOtherMutation)
#[derive(async_graphql::MergedObject, Default)]
pub struct MutationRoot(ArticleMutation);
