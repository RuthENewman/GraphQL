import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
import db from './db.js';

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
        users(parent, args, { db }, info) {
            if (!args.query) {
                return db.users;
            }
            return db.users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        posts(parent, args, { db }, info) {
            if (!args.query) {
                return db.posts;
            }
            return db.posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        comments(parent, args, { db }, info) {
            return db.comments;
        }
    },
    Mutation: {
        createUser(parent, args, { db }, info) {
            const email = db.users.some((user) => user.email === args.data.email);
            if (email) {
                throw new Error('Email address already being used.');
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }
            db.users.push(user);
            return user;
        },
        deleteUser(parent, args, { db }, info) {
            const userIndex = db.users.findIndex((user) => user.id === args.id);
            if (userIndex === -1) {
                throw new Error("User not found");
            }
            const deletedUser = db.users.splice(userIndex, 1)[0];
            db.posts = db.posts.filter((post) => {
               const match = post.author === args.id;
               
               if (match) {
                   db.comments = db.comments.filter((comment) => comment.post !== post.id);
               }
               return !match;
            });
            db.comments = db.comments.filter((comment) => comment.author !== args.id);
            return deletedUser;
        },
        createPost(parent, args, { db }, info) {
            const author = db.users.some((user) => user.id === args.data.author);

            if (!author) {
                throw new Error('User not found');
            }
            const post = {
                id: uuidv4(),
                ...args.data
            }
            db.posts.push(post);
            return post;
        },
        deletePost(parent, args, { db }, info) {
            const postIndex = db.posts.findIndex((post) => post.id === args.id);
            if (postIndex === -1) {
                throw new Error("Post not found");
            }
            const deletedPost = db.posts.splice(postIndex, 1)[0];
            db.comments = db.comments.filter((comment) => comment.post !== args.id);
            return deletedPost;
        },
        createComment(parent, args, { db }, info) {
            const userFound = db.users.find((user) => user.id === args.data.author);
            const postFound = db.posts.find((post) => post.id === args.data.post && post.published);
            
            if (!userFound || !postFound) {
                throw new Error('User and post not found');
            }
            
            const comment = {
                id: uuidv4(),
                ...args.data
            }
            db.comments.push(comment);
            return comment;
        },
        deleteComment(parent, args, { db }, info) {
            const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);
            if (commentIndex === -1) {
                throw new Error("Comment not found");
            }
            const deletedComment = db.comments.splice(commentIndex, 1)[0];
            return deletedComment;
        }
    },
    Post: {
        author(parent, args, { db }, info) {
            return db.users.find((user) => {
                return user.id === parent.author;
            });
        },
        comments(parent, args, { db }, info) {
            return db.comments.filter((comment) => {
                return comment.post === parent.id;
            });
        }
    },
    User: {
        posts(parent, args, { db }, info) {
            return db.posts.filter((post) => {
                return post.author === parent.id;
            });
        }, 
        comments(parent, args, { db }, info) {
            return db.comments.filter((comment) => {
                return comment.author === parent.id;
            });
        }       
    },
    Comment: {
        author(parent, args, { db }, info) {
            return db.users.find((user) => {
                return user.id === parent.author;
            });
        },
        post(parent, args, { db }, info) {
            return db.posts.find((post) => {
                return post.id === parent.post;
            });
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
});

server.start(() => {
    console.log('The server is up and running');
})