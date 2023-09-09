import status from 'http-status';
import { Response } from 'express';



export default {
  success: (res:Response, message:string, code:number, data:any) => res.status(code).json({
    status: 'success',
    message,
    code,
    data: data || [],
  }),

  error: (res:Response, message = '', code = 500) => {
    const msg = code === 500 ? 'Internal Server Error' : message;
    return res.status(code).json({
      status: 'error',
      error: status[`${code}_NAME`],
      message: msg,
      code,
    });
  },
};
