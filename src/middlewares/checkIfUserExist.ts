import { NextFunction, Request, Response } from "express"
import { user } from "../services/auth.service"
import response from "../utils/response.utils"
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status"

export const checkIfUserExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exist = await user(req.body.email)
        if (exist) return response(res, 'user with this email already exist', BAD_REQUEST)

        next()
    } catch (error) {
        return response(res, 'server error', INTERNAL_SERVER_ERROR, error)
    }
} 
