import { gql } from '@apollo/server';

const typeDefs = gql`
  # Book type matches your existing Book model
  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  # User type matches your existing User model
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  # Auth type for login/signup responses
  type Auth {
    token: ID!
    user: User
  }

  # Input type for book data when saving
  input BookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  # Queries (GET requests)
  type Query {
    me: User
  }

  # Mutations (POST/PUT/DELETE requests)
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;