import { response, Response } from 'express';

interface SuccessResponseOptions {
  status: number;
  message?: string;
  data?: any;
}

interface ErrorResponseOptions {
  status: number;
  error: string;
  message?: string;
  data?: any;
}


const SuccessResponse = (res: Response, options: SuccessResponseOptions): void => {
    const { status = 200, message = 'Success', data } = options;

    const response: any = { 
      message: message,
      data: data??undefined,
      status: status
    };

    res.status(status).json({...response});
  }

const ErrorResponse = (res: Response, options: ErrorResponseOptions): void => {
    const { status, error, message = 'Error', data } = options;

    const response: any = {
      error,
      message
    };

    if (data !== undefined) {
      response.data = data;
    }

    res.status(status).json(response);
  }


export {
  SuccessResponse,
  ErrorResponse
};