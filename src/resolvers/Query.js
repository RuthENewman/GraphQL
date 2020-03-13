const Query = {
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
};

export { Query as default };