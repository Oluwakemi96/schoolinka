import bcrypt, { hash } from 'bcrypt';
import config from '../../config/index';
import jwt from 'jsonwebtoken';


export const hashUserPassword = (password: string): string => {
    return bcrypt.hashSync(password, Number(config.SCHOOLINKA_BCRYPT_SALT_ROUNDS));
};

export const comparePassword = (password: string, hashedPassword: string)=> {
    return bcrypt.compare(password, hashedPassword);
};

export const decodeToken = (token:string) => {
    try {
      return jwt.verify(token, config.SCHOOLINKA_JWT_SECRET_KEY);
    } catch (error) {
      return error;
    }
  };