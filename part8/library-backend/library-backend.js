const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server');
const { PubSub } = require('apollo-server');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/user');
const Book = require('./models/book');
const Author = require('./models/author');

const pubsub = new PubSub();

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY';

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!,
    allAuthors: [Author!]!,
    allBooks(author: String, genre: String): [Book!]!,
    me: User,
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

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
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
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author });

        const books = await Book.find({
          $and: [
            { author: { $in: author.id } },
            { genres: { $in: args.genre } },
          ],
        }).populate("author");

        return books;
      } else if (args.author) {
        const author = await Author.findOne({ name: args.author });

        const books = await Book.find({ author: { $in: author.id } }).populate("author");

        return books;
      } else if (args.genre) {
        const books = await Book.find({ genres: { $in: args.genre } }).populate("author");

        return books;
      } else {
        return Book.find({}).populate("author");
      }
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, context ) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      const authors = await Author.find({});
      const filteredAuthors = authors.length === 0 ? [] : authors.filter(a => a.name === args.author);

      if (filteredAuthors.length === 0) {
        const author = new Author({ name: args.author, born: null });

        try {
          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }

        filteredAuthors.push(author);
      }

      const book = new Book({ ...args, author: filteredAuthors[0] });

      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book });

      return book;
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;

      try {
        return author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },

    createUser: (root, args) => {
      const user = new User({ username: args.username });

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if ( !user || args.password !== '123' ) {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
