import { gql } from "@apollo/client";

export const POST_CARD_FIELDS = gql`
  fragment PostCardFields on Post {
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
    publishedAt
  }
`;

export const GET_POSTS = gql`
  ${POST_CARD_FIELDS}
  query GetPosts($page: Int, $limit: Int, $category: String, $tag: String, $search: String) {
    posts(page: $page, limit: $limit, category: $category, tag: $tag, search: $search) {
      totalCount
      totalPages
      currentPage
      posts {
        ...PostCardFields
      }
    }
  }
`;

export const GET_POST = gql`
  query GetPost($slug: String!) {
    post(slug: $slug) {
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
      publishedAt
    }
  }
`;

export const GET_FILTERS = gql`
  query GetFilters {
    categories
    tags
  }
`;
