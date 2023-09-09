import * as types from '../types/index';

export default{
    signUpUser:(body:types.users, hashedPassword:string) => [
        body.email,
        body.first_name,
        body.last_name,
        hashedPassword
    ],
    addPosts:(body:types.posts, user:types.users) => [
        user.user_id,
        body.post_title,
        body.content
    ],
    editPost:(body:types.posts, post:types.posts, post_id:string) => [
        post_id,
        body.post_title || post.post_title,
        body.content || post.content
    ],

    fetchAllPosts: (query: types.posts) => [
        query.post_title ? `%${query.post_title}%` : null,
        query.author ? `%${query.author}%` : null,
        query.start_date || null,
        query.end_date || null,
        query.page ? (query.page - 1) * (query.per_page || 10) : 0,
        query.per_page ? query.per_page : '10'

    ]
};
