import AuthQueries from '../queries/query.users';
import dayjs from 'dayjs';
import * as Hash from '../../lib/helpers/hash.auth';
import  ApiResponse from '../../lib/http/lib.http.response';
import Payload from '../../lib/payloads/lib.payload.users';
import logger from '../../config/logger';
import { db } from '../../config/db/index';
import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../../lib/types';
import JWT from 'jsonwebtoken';
import config from '../../config/index';
import * as types from '../../lib/types/index';
import * as Helpers from '../../lib/helpers/helpers';



export const signUpUser = async (req: RequestWithUser, res: Response, next: any) => {
    try {
        const { body } = req;
        const hashedPassword = Hash.hashUserPassword(body.password);
        logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, successfully hashed user password signUpUser.controller.users.auth`);
        const payload = Payload.signUpUser(body, hashedPassword);
        const user = await db.oneOrNone(AuthQueries.registerUser, payload);
        logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, successfully registered a user in the DB signUpUser.controller.users.auth`);
        delete user.password;
        return ApiResponse.success(res, 'User signed up successfully', 201, user);
    } catch (error) {
        error.label = 'Sign Up Controller'
        logger('error', `signing up user failed::  Sign Up Controller::::error=>  ${error.message}`)
    }
};

export const login = async (req: RequestWithUser, res:Response, next:NextFunction) => {
    try {
        const { user, user: { user_id } } = req;
        const token = JWT.sign({
           user_id
        }, config.SCHOOLINKA_JWT_SECRET_KEY, {
            expiresIn: '1hr'
        });
        logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, successfully generate a JWT token login.controller.users.auth`);
        delete user.password
        const data = {
            ...user,
            token
        }
        return ApiResponse.success( res, 'User logged in successfully', 200, data );
    } catch (error) {
        error.label = 'Login Controller'
        logger('error', `logging in failed:: Login Controller::::error=>  ${error.message}`)
    }
}

export const addPosts = async (req: RequestWithUser, res: Response, next: any) => {
    try {
        const { user, body } = req; 
        const payload = Payload.addPosts(body, user);
        const post = await db.oneOrNone(AuthQueries.addPosts, payload)
        logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, successfully uploads a post addposts.controller.users.auth`);
        return ApiResponse.success( res, 'Post added successfully', 200, post );
    } catch (error) {
        error.label = 'Add Posts Controller'
        logger('error', `adding post failed:: Add Posts Controller::::error=>  ${error.message}`)
 
    }
}
export const getPostById = async (req: RequestWithUser, res: Response, next: any) => {
    try {
        const { params: { post_id } } = req; 
        const post:object = await db.oneOrNone(AuthQueries.getPostById, post_id)
        logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, successfully fetched a particular post getPostById.controller.users.auth`);
        return ApiResponse.success( res, 'Post fetched successfully', 200, post );
    } catch (error) {
        error.label = 'Add Posts Controller'
        logger('error', `getting a particular post failed:: Add Posts Controller::::error=>  ${error.message}`)
    }
}

export const editPost = async (req: RequestWithUser, res: Response, next: any) => {
    try {
        const { params: { post_id }, body } = req;
        const post:types.posts = await db.oneOrNone(AuthQueries.getPostById, post_id);
        logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, successfully fetched a particular post editPost.controller.users.auth`);
        const payload = Payload.editPost(body, post, post_id);
        await db.oneOrNone(AuthQueries.editPost, payload);
        logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, successfully edited a post editPost.controller.users.auth`);
        return ApiResponse.success( res, 'Post edited successfully', 200, [] );
    } catch (error) {
        error.label = 'Edit Post Controller'
        logger('error', `editing a particular post failed:: Edit Posts Controller::::error=>  ${error.message}`);

    }
};

export const deletePost = async (req: RequestWithUser, res: Response, next: any) => {
    try {
       const { params: {post_id} } = req;
       await db.oneOrNone(AuthQueries.deletePost, post_id);
       logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, successfully deleted a post deletePost.controller.users.auth`);
       return ApiResponse.success( res, 'Post deleted successfully', 200, [] );
    } catch (error) {
        error.label = 'Edit Post Controller'
        logger('error', `deleting a particular post failed:: Delete Posts Controller::::error=>  ${error.message}`) 
    }
}

export const fetchAndFilterPosts = async (req: RequestWithUser, res: Response, next: any) => {
    try {
        const { query } = req;
        const payload = Payload.fetchAllPosts(query);
        const  posts  = await db.any(AuthQueries.fetchAndFilterPosts, payload);
        logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, successfully fetched all posts from the DB fetchAndFilterPosts.controller.users.auth`);
        let totalPosts:number;
            if (posts.length === 0) {
                totalPosts = 0;
            } else {
                totalPosts = posts[0].total;
            }
        const data = {
            page: Number(req.query.page) || 1,
            total_posts: Number(totalPosts),
            total_pages: Helpers.calculatePages(Number(totalPosts), Number(req.query.per_page) || 10),
            posts
        };
        return ApiResponse.success( res, 'Posts fetched successfully', 200, data );

    } catch (error) {
        error.label = 'Fetch and filter posts Controller'
        logger('error', `fetching and filtering posts failed:: fetchAndFilterPosts Controller::::error=>  ${error.message}`) 
  
    }
}

