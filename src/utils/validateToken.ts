import jwt from 'jsonwebtoken'
import response from './response.utils'
import { Request, Response } from 'express'
import { userById } from '../services/auth.service'
import { INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from 'http-status'

const { SECRET } = process.env

// check if user exist
export const validateToken = async (req: Request, res: Response, next: any) => {
    try {
        if (!req.headers.authorization) return response(res, 'not authorized', UNAUTHORIZED)
        const token = req.headers.authorization
        const isValid = jwt.verify(token as string, SECRET as string)

        //@ts-ignore
        req.user = isValid

        //@ts-ignore
        const user = await userById(isValid.id)
        if (!user) return response(res, 'user not found', NOT_FOUND)
        next()
    } catch (error) {
        return response(res, 'server error', INTERNAL_SERVER_ERROR, error)
    }
}
