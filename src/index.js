import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data 

const users = [{
    id: '1',
    name: 'Ruth',
    email: 'ruth@gmail.com',
    age: 31
}, {
    id: '2',
    name: 'Sarah',
    email: 'sarah@gmail.com',
    age: 26
}, {
    id: '3',
    name: 'Naomi',
    email: 'naomi@gmail.com',
    age: 34
}];

// Demo post data 

const posts = [{
    id: '1',
    title: 'First post',
    body: 'Some super interesting content',
    published: true,
    author: 1
}, {
    id: '2', 
    title: 'Second post',
    body: 'Something else really interesting',
    published: true,
    author: '1'
}, {
    id: '3',
    title: 'Draft future post',
    body: 'Still thinking what to add here',
    published: false,
    author: '2'
}];

const comments = [{
        id: '188',
        text: "Ooh how interesting",
        author: '2',
        post: '1'
}, {
        id: '189',
        text: "Thanks for the compliment",
        author: '1',
        post: '1'
}, {
        id: '211',
        text: "Oooh how insightful",
        author: '3',
        post: '2'
}, {
        id: '214',
        text: "I disagree",
        author: '2',
        post: '2'
}];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        post: Post!
        me: User!
    }
    
    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!
    }
     
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        },
        comments(parent, args, context, info) {
            return comments;
        }
    },
    Mutation: {
        createUser(parent, args, context, info) {
            const email = users.some((user) => user.email === args.email);
            if (email) {
                throw new Error('Email address already being used.');
            }

            const user = {
                id: uuidv4(),
                ...args
            }
            users.push(user);
            return user;
        },
        createPost(parent, args, context, info) {
            const author = users.some((user) => user.id === args.author);

            if (!author) {
                throw new Error('User not found');
            }
            const post = {
                id: uuidv4(),
                ...args
            }
            posts.push(post);
            return post;
        },
        createComment(parent, args, context, info) {
            const userFound = users.find((user) => user.id === args.author);
            const postFound = posts.find((post) => post.id === args.post && post.published);
            
            if (!userFound || !postFound) {
                throw new Error('User and post not found');
            }
            
            const comment = {
                id: uuidv4(),
                ...args
            }
            comments.push(comment);
            return comment;
        }
    },
    Post: {
        author(parent, args, context, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        comments(parent, args, context, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id;
            });
        }
    },
    User: {
        posts(parent, args, context, info) {
            return posts.filter((post) => {
                return post.author === parent.id;
            });
        }, 
        comments(parent, args, context, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id;
            });
        }       
    },
    Comment: {
        author(parent, args, context, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        post(parent, args, context, info) {
            return posts.find((post) => {
                return post.id === parent.post;
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