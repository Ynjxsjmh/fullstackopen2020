const { ApolloServer, gql } = require('apollo-server');
const { v1: uuid } = require('uuid');
const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');

mongoose.set('useFindAndModify', false);

const MONGODB_URI = 'mongodb://localhost/graphql?retryWrites=true';

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int,
    bookCount: Int,
  }

  type Book {
    title: String!
    published: Int!,
    author: Author!,
    id: ID!
    genres: [String]!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!,
    allAuthors: [Author!]!,
    allBooks(author: String, genre: String): [Book!]!,
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!,
      author: String!
      genres: [String]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
  Author: {
    bookCount: (root) => {
      return books.filter(p => p.author === root.name).length;
    }
  },

  Query: {
    authorCount: () => authors.length,
    bookCount: () => books.length,
    allAuthors: () => authors,
    allBooks: (root, args) => {
      let filteredBooks = books;

      if (args.author !== undefined) {
        filteredBooks = filteredBooks.filter(b => b.author === args.author);
      }

      if (args.genre !== undefined) {
        filteredBooks = filteredBooks.filter(b => b.genres.includes(args.genre));
      }

      return filteredBooks;
    }
  },

  Mutation: {
    addBook: (root, args) => {
      const book = { ...args, id: uuid() };
      books = books.concat(book);
      if (authors.filter(a => a.name === args.author).length === 0) {
        const author = { name: args.author, born: null, id: uuid() };
        authors = authors.concat(author);
      }
      return book;
    },
    editAuthor: (root, args) => {
      const author = authors.find(p => p.name === args.name);

      if (!author) {
        return null;
      }

      const editedAuthor = { ...author, born: args.setBornTo };
      authors = authors.map(p => p.name === args.name ? editedAuthor : p);
      return editedAuthor;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
