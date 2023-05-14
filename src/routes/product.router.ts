import { Router } from 'express'
import { validateToken } from '../utils/validateToken'
import { checkIfProdNameExist, checkIfProductExist } from '../middlewares/checkIfProductExist'
import { getProducts, createProduct, updateProduct, deleteProduct, getProduct, getMyProducts } from '../controllers/product.controller'

export const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/single/:name', getProduct)
productRouter.get('/my', validateToken, getMyProducts)
productRouter.post('/', validateToken, checkIfProdNameExist, createProduct)
productRouter.delete('/:id', validateToken, checkIfProductExist, deleteProduct)
productRouter.put('/:id', validateToken, checkIfProductExist, checkIfProdNameExist, updateProduct)
