import 'dotenv/config';

const {
    SCHOOLINKA_NODE_ENV,
    SCHOOLINKA_PORT,
    SCHOOLINKA_DEV_DATABASE_URL,
    SCHOOLINKA_DEV_BCRYPT_SALT_ROUNDS,
    SCHOOLINKA_DEV_JWT_SECRET_KEY,
} = process.env

export default {
    SCHOOLINKA_NODE_ENV,
    SCHOOLINKA_PORT,
    SCHOOLINKA_URL: SCHOOLINKA_DEV_DATABASE_URL,
    SCHOOLINKA_BCRYPT_SALT_ROUNDS: SCHOOLINKA_DEV_BCRYPT_SALT_ROUNDS,
    SCHOOLINKA_JWT_SECRET_KEY: SCHOOLINKA_DEV_JWT_SECRET_KEY,
}