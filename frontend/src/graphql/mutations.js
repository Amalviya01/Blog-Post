import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation AddPost($input: PostInput!) {
    addPost(input: $input) {
      id
      slug
    }
  }
`;
