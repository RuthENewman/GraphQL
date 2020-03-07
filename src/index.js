import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(numbers: [Float!]!): Float!
        scores: [Int!]! 
        post: Post!
        me: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

// Resolvers

const resolvers = {
    Query: {
        me() {
            return {
                id: '123098',
                name: 'Ruth',
                email: 'ruth@gmail.com'
            }
        },
        post() {
            return {
                id: '2345rghyz',
                title: 'First post',
                body: 'Testing to see if works',
                published: false
            }
        },
        greeting(parent, args, context, info) {
            if (args.name && args.position) {
                return `Hello ${args.name}! You are my favourite ${args.position}`;
            } else {
                return "Hello there";
            }
        },
        add(parent, args, context, info) {
            if (args.numbers.length === 0) {
                return 0;
            }

            return args.numbers.reduce((a, b) => {
                return a + b;
            });            
        },
        scores(parent, args, context, info) {
            return [91, 82, 97]
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