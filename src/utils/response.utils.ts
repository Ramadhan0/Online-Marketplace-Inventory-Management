import { Response } from 'express';

const response = (res: Response, message: string, status: any, data?: any) => {
    return res.status(status).json({
        status,
        message,
        data,
    });
};

export default response;
