import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYearL Int
        rating: Float
        inStock: Boolean!
    }
`;

// Resolvers

const resolvers = {
    Query: {
        title() {
            return 'Product Name';
        },
        price() {
            return 19.99
        },
        releaseYear() {
            return 2020;
        },
        rating() {
            return null
        },
        inStock() {
            return true
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('The server is up and running');
})