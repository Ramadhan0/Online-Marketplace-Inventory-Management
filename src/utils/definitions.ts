import { Request } from "express";

export interface IGetUserAuthInfoRequest extends Request {
    user: {
        id: number,
        name: string,
        email: string
    }
}
