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

const db = {
    users,
    posts,
    comments
};

export { db as default };