import  ApiResponse from '../../lib/http/lib.http.response';
import { Request, Response, NextFunction } from 'express';

/**
 * Joi validation of request parameters
 * @param {function} schema - the Joi schema
 * @param {string} type - the request type
 * @returns {object} - Returns an object (error or response).
 * @memberof ModelMiddleware
 */

const validateData = (schema, type:string) => async (req:Request, res:Response, next: NextFunction) => {
  interface schemaParams {
    [requestType: string]: object
  }
  try {
    const getType: schemaParams =  {
      payload: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      files: req.files,
    };
    const data = getType[type];
    const options = { language: { key: '{{key}} ' } };

    const valid = await schema.validate(data, options);
    if (valid.error) {
      const { message } = valid.error.details[0];
      return ApiResponse.error(res, message.replace(/["]/gi, ''), 422);
    }
  } catch (error) {
    return error;
  }
  return next();
};

export default validateData;
