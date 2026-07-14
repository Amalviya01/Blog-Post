export const typeDefs = `#graphql
  type Author {
    name: String!
    avatar: String
  }

  type Post {
    id: ID!
    title: String!
    slug: String!
    excerpt: String
    content: String!
    coverImage: String
    category: String
    tags: [String!]!
    author: Author!
    status: String!
    viewCount: Int!
    publishedAt: String!
    createdAt: String!
    updatedAt: String!
  }

  type PostsResult {
    posts: [Post!]!
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
  }

  input AuthorInput {
    name: String!
    avatar: String
  }

  input PostInput {
    title: String!
    slug: String
    excerpt: String
    content: String!
    coverImage: String
    category: String
    tags: [String!]
    author: AuthorInput!
    status: String
    publishedAt: String
  }

  type Query {
    posts(page: Int, limit: Int, category: String, tag: String, search: String): PostsResult!
    post(slug: String!): Post
    categories: [String!]!
    tags: [String!]!
  }

  type Mutation {
    addPost(input: PostInput!): Post!
    updatePost(id: ID!, input: PostInput!): Post!
    deletePost(id: ID!): Boolean!
    incrementPostViews(slug: String!): Post!
  }
`;
