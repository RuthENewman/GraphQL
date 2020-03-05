import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        student: Boolean!
        gpa: Float
    }
`;

// Resolvers

const resolvers = {
    Query: {
        id() {
            return 'abcde12345';
        },
        name() {
            return 'Ruth'
        },
        age() {
            return 31
        },
        student() {
            return false
        },
        gpa() {
            return null
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