import { NextFunction, Request, Response } from 'express'
import response from '../utils/response.utils'
import { product, productById } from '../services/product.service'
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status'

export const checkIfProdNameExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exist = await product(req.body.name)
        if (exist && exist.id !== parseInt(req.params.id))
            return response(res, 'product with this name already exist', BAD_REQUEST)

        next()
    } catch (error) {
        return response(res, 'server error', INTERNAL_SERVER_ERROR, error)
    }
}

export const checkIfProductExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exist = await productById(req.params.id)

        if (!exist) return response(res, 'product not found', NOT_FOUND)

        // a user can only modify a product he owns
        // @ts-ignore
        if (exist.ownerId !== parseInt(req.user.id))
            return response(res, 'unauthorized', BAD_REQUEST)

        next()
    } catch (error) {
        return response(res, 'server error', INTERNAL_SERVER_ERROR, error)
    }
} 
