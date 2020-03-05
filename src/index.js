import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

// Resolvers

const resolvers = {
    Query: {
        hello() {
            return 'This is my first query!';
        },
        name() {
            return "Ruth Newman";
        },
        location() {
            return "London";
        },
        bio() {
            return "A former aid worker turned Full Stack Developer, originally from Manchester, living in London";
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