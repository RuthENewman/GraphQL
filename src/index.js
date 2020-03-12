import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data 

let users = [{
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

let posts = [{
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

let comments = [{
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
            const email = users.some((user) => user.email === args.data.email);
            if (email) {
                throw new Error('Email address already being used.');
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }
            users.push(user);
            return user;
        },
        deleteUser(parent, args, context, info) {
            const userIndex = users.findIndex((user) => user.id === args.id);
            if (userIndex === -1) {
                throw new Error("User not found");
            }
            const deletedUser = users.splice(userIndex, 1)[0];
            posts = posts.filter((post) => {
               const match = post.author === args.id;
               
               if (match) {
                   comments = comments.filter((comment) => comment.post !== post.id);
               }
               return !match;
            });
            comments = comments.filter((comment) => comment.author !== args.id);
            return deletedUser;
        },
        createPost(parent, args, context, info) {
            const author = users.some((user) => user.id === args.data.author);

            if (!author) {
                throw new Error('User not found');
            }
            const post = {
                id: uuidv4(),
                ...args.data
            }
            posts.push(post);
            return post;
        },
        deletePost(parent, args, context, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id);
            if (postIndex === -1) {
                throw new Error("Post not found");
            }
            const deletedPost = posts.splice(postIndex, 1)[0];
            comments = comments.filter((comment) => comment.post !== args.id);
            return deletedPost;
        },
        createComment(parent, args, context, info) {
            const userFound = users.find((user) => user.id === args.data.author);
            const postFound = posts.find((post) => post.id === args.data.post && post.published);
            
            if (!userFound || !postFound) {
                throw new Error('User and post not found');
            }
            
            const comment = {
                id: uuidv4(),
                ...args.data
            }
            comments.push(comment);
            return comment;
        },
        deleteComment(parent, args, context, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id);
            if (commentIndex === -1) {
                throw new Error("Comment not found");
            }
            const deletedComment = comments.splice(commentIndex, 1)[0];
            return deletedComment;
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
    typeDefs: './src/schema.graphql',
    resolvers
});

server.start(() => {
    console.log('The server is up and running');
})