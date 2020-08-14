const { ApolloServer, gql } = require('apollo-server');
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
      return Book.countDocuments({ author: root });
    }
  },

  Query: {
    authorCount: () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),
    allAuthors: () => Author.find({}),
    allBooks: async (root, args) => {
      let filteredBooks = await Book.find({});

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
    addBook: async (root, args) => {
      const authors = await Author.find({});
      const filteredAuthors = authors.length === 0 ? [] : authors.filter(a => a.name === args.author);

      if (filteredAuthors.length === 0) {
        const author = new Author({ name: args.author, born: null });
        await author.save();
        filteredAuthors.push(author);
      }

      const book = new Book({ ...args, author: filteredAuthors[0] });
      await book.save();

      return book;
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;

      return author.save();
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
