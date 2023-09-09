import { Router } from "express";
import * as AuthMiddlewares from '../middlewares/middlewares.users';
import * as AuthControllers from '../controllers/controllers.users';
import Model from '../middlewares/middlewares.model';
import * as Schema from '../../lib/schema/lib.schema';

const router = Router();

router.post(
    '/signup',
    Model(Schema.signUp, 'payload'),
    AuthMiddlewares.checkIfEmailAlreadyExists,
    AuthControllers.signUpUser
);

router.post(
    '/login',
    Model(Schema.login, 'payload'),
    AuthMiddlewares.checkIfEmailExists,
    AuthMiddlewares.checkIfPasswordIsValid,
    AuthControllers.login
)

router.post(
    '/add-posts',
    AuthMiddlewares.validateAuthToken,
    Model(Schema.addPosts, 'payload'),
    AuthControllers.addPosts
)

router.get(
    '/:post_id/post',
    Model(Schema.postId, 'params'),
    AuthMiddlewares.checkIfAProductExist,
    AuthControllers.getPostById
)

router.patch(
    '/:post_id/post',
    AuthMiddlewares.validateAuthToken,
    Model(Schema.postId, 'params'),
    Model(Schema.editPost, 'payload'),
    AuthMiddlewares.checkIfAProductExist,
    AuthControllers.editPost
)
router.delete(
    '/:post_id/post',
    AuthMiddlewares.validateAuthToken,
    Model(Schema.postId, 'params'),
    AuthMiddlewares.checkIfAProductExist,
    AuthControllers.deletePost
)
router.get(
    '/post',
    Model(Schema.fetchAndFilterPosts, 'query'),
    AuthControllers.fetchAndFilterPosts
)

export default router
