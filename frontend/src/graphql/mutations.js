import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation AddPost($input: PostInput!) {
    addPost(input: $input) {
      id
      slug
    }
  }
`;

export const INCREMENT_POST_VIEWS = gql`
  mutation IncrementPostViews($slug: String!) {
    incrementPostViews(slug: $slug) {
      id
      title
      slug
      excerpt
      content
      coverImage
      category
      tags
      author {
        name
        avatar
      }
      viewCount
      publishedAt
    }
  }
`;
