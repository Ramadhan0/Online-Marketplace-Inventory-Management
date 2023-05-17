import { Request, Response } from 'express'
import response from '../utils/response.utils'
import sendMessageToSQSQueue from '../utils/sqs.utils'
import { OK, NOT_FOUND, INTERNAL_SERVER_ERROR, CREATED } from 'http-status'
import { products, newProduct, editProduct, product, removeProduct, userProducts } from '../services/product.service'

export const getProducts = async (req: Request, res: Response) => {
    const product = await products()
    return response(res, 'success', OK, product)
}

export const getMyProducts = async (req: Request, res: Response) => {

    //@ts-ignore 
    const ownerId = req.user.id
    const myProducts = await userProducts(ownerId)
    if (myProducts.length)
        return response(res, 'success', OK, myProducts)
    return response(res, 'products not found', NOT_FOUND, myProducts)
}

export const getProduct = async (req: Request, res: Response) => {

    const productName = req.params.name
    const prod = await product(productName)
    if (prod) return response(res, 'success', OK, prod)
    return response(res, 'product not found', NOT_FOUND)
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const ownerId = req.user.id
        const product = await newProduct({ ...req.body, ownerId })
        await sendMessageToSQSQueue(`product created ${product.name}`)
        return response(res, 'success', CREATED, product)
    } catch (error) {
        return response(res, 'server error', INTERNAL_SERVER_ERROR, error)
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await editProduct(req.params.id, req.body)
        return response(res, 'success', OK, product)
    } catch (error) {
        return response(res, 'server error', INTERNAL_SERVER_ERROR, error)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    await removeProduct(req.params.id)
    return response(res, 'success', OK)
}
