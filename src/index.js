import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data 

const users = [{
    id: 1,
    name: 'Ruth',
    email: 'ruth@gmail.com',
    age: 31
}, {
    id: 2,
    name: 'Sarah',
    email: 'sarah@gmail.com',
    age: 26
}, {
    id: 3,
    name: 'Naomi',
    email: 'naomi@gmail.com',
    age: 34
}];

// Demo post data 

const posts = [{
    id: 1,
    title: 'First post',
    body: 'Some super interesting content',
    published: true
}, {
    id: 2, 
    title: 'Second post',
    body: 'Something else really interesting',
    published: true
}, {
    id: 3,
    title: 'Draft future post',
    body: 'Still thinking what to add here',
    published: false
}];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
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
        users(parent, args, context, info) {
            if (!args.query) {
                return users;
            }
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        posts(parent, args, context, info) {
            if (!args.query) {
                return posts;
            }
            return posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
            });
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