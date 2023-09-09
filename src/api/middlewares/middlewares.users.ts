import { Request, Response, NextFunction } from 'express';
import {  users, RequestWithUser
} from '../../lib/types';
import * as Hash from '../../lib/helpers/hash.auth';
import { db } from '../../config/db';
import ApiResponse from '../../lib/http/lib.http.response';
import dayjs from 'dayjs';
import AuthQureies from '../queries/query.users';
import logger from '../../config/logger/index';
import * as Helpers from '../../lib/helpers/helpers';

export const validateAuthToken = async (req: RequestWithUser, res: Response, next:NextFunction) => {
    try {
        let token:string = req.headers.authorization;
        if (!token) {
            logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, 'successfully confirms token does not exist in the headers validateAuthToken.middlewares.auth`)
            return ApiResponse.error(res, 'No Token', 401);
        }
        if (!token.startsWith('Bearer ')) {
            return ApiResponse.error(res, 'Invalid Token', 401);
          }
          if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
            logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, 'successfully extracts token validateAuthToken.middlewares.auth`)
            const decoded = Hash.decodeToken(token)
            logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, 'successfully decoded the token validateAuthToken.middlewares.auth`)
        if (decoded.message){
            if (decoded.message === 'jwt expired'){
               return ApiResponse.error(res, 'Session Expired', 401);  
            }
            logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, 'successfully confirms that the decoded has a message validateAuthToken.middlewares.auth`)
            return ApiResponse.error(res, decoded.message, 401);
        }   
        const user = await db.oneOrNone(AuthQureies.fetchUserById, decoded.user_id);
        logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, 'successfully fetched user by its id validateAuthToken.middlewares.auth`)
        if(!user) {
         logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, 'successfully confirms user does not exist in the DB validateAuthToken.middlewares.auth`)
         return ApiResponse.error(res,'Invalid Token', 401);
        }
          req.user = user;
          return next();


          }
    } catch (error) {
        error.label = 'Validate Auth token middleware'
        logger('error', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, validating auth token failed:: Validate Auth token middleware, ::::error=>  ${error.message} `)

    }
}


export const checkIfEmailAlreadyExists = async (req: RequestWithUser, res: Response, next:NextFunction) => {
    try {
        const { email } = req.body;
        const user:users = await db.oneOrNone(AuthQureies.fetchUserByEmail, email);
        req.user = user;
        logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, 'successfully checked if user with the email exists checkIfEmailAlreadyExists.middlewares.auth`)
        if (user) {
            logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, 'successfully confirms user with the email already exists checkIfEmailAlreadyExists.middlewares.auth`)
            return ApiResponse.error(res, 'User Already Exist', 403)
        }
        return next();
    } catch (error) {
        error.label = 'Check If Email already Exists Middleware'
        logger('error', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, checking if email already exists failed::: Check If Email already Exists Middleware, ::::error=>  ${error.message} `)
    }
};

export const checkIfEmailExists = async  (req: RequestWithUser, res: Response, next:NextFunction) => {
    try {
      const { email } = req.body;
      const user:users = await db.oneOrNone(AuthQureies.fetchUserByEmail, email);
      req.user = user;
      logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, 'successfully checked if user with the email exists checkIfEmailExists.middlewares.auth`)
      if (!user){
        logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, 'successfully confirms email does not exist checkIfEmailExists.middlewares.auth`)
        return ApiResponse.error(res, 'User does not exist', 403)
        }    
        return next();
    } catch (error) {
        error.label = 'Check if email exists middleware'
        logger('error', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, checking if email already exists failed:: Check if email exists middleware, ::::error=>  ${error.message} `)

    }
}


export const checkIfPasswordIsValid = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
       const { body: { password }, user } = req;
       const passwordMatch = await Hash.comparePassword(password, user.password);
       if(!passwordMatch){
          logger('info', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, 'successfully confirms passwords do not match checkIfPasswordIsValid.middlewares.auth`)
           return ApiResponse.error(res, 'Invalid Password', 403);
       }
       return next()
    } catch (error) {
       error.label = 'Check if password is valid middleware' 
        logger('error', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, checking if password is valid failed:: Check if password is valid middleware,
         ::::error=>  ${error.message} `)
    }
};


export const checkIfAProductExist = async (req: RequestWithUser, res: Response, next:NextFunction) => {
    try {
        const { params: { post_id } } = req;
        const post = await db.oneOrNone(AuthQureies.getPostById, post_id);
        if(!post) {
            return ApiResponse.error(res, 'Post does not exist', 401); 
        }
        return next()
    } catch (error) {
        error.label = 'Check if a product exist middleware' 
        logger('error', `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}, Check if a product exist middleware failed:: Check if password is valid middleware,
         ::::error=>  ${error.message} `)

    }
}

