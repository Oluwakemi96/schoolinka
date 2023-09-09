import {  Request, Response } from 'express';


export type users = {
    user_id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string
}

export interface RequestWithUser extends Request{
    user: users
};
export type posts = {
    start_date?: Date,
    end_date?: Date,
    author?: string,
    post_id?: string,
    post_title?: string,
    content?: string,
    is_deleted?: string,
    page?: number,
    per_page?: number
}
// export type posts = {
//     category?: string,
//     sizes?: string,
//     product_image?: string,
//     status?: string,
//     quantity?: string,
//     description?: string,
//     page?: number,
//     per_page?: number
// }

