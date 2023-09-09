import Joi from 'joi';

export const signUp: object = Joi.object({
    email: Joi.string().email().required(),
    first_name: Joi.string().regex(new RegExp('^[a-zA-Z0-9-]+$')).messages({
        'string.pattern.base': 'Invalid first name input'
      }).required(),
      last_name: Joi.string().regex(new RegExp('^[a-zA-Z0-9-]+$')).messages({
        'string.pattern.base': 'Invalid last name input'
      }).required(),
      password: Joi.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')).messages({
        'string.pattern.base': 'Invalid password combination'
      }).required().min(8)    
});

export const login: object = Joi.object().keys({
    email: Joi.string().email(). required(),
    password: Joi.string().required().min(8)
});

export const addPosts: object = Joi.object().keys({
    post_title: Joi.string().required(),
    content: Joi.string().required()
});

export const editPost: object = Joi.object().keys({
    post_title: Joi.string().optional(), 
    content: Joi.string().optional()
});

export const postId: object = Joi.object().keys({
    post_id: Joi.string().required(),
});

export const fetchAndFilterPosts: object = Joi.object().keys({
    post_title: Joi.string().optional(),
    author: Joi.string().optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    page: Joi.number().positive().optional(),
    per_page: Joi.number().positive().optional(),
});