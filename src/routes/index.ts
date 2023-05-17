import { Router } from 'express';
import { authRouter } from './auth.router';
import { productRouter } from './product.router'

const indexRouter = Router()

indexRouter.use('/auth', authRouter)
indexRouter.use('/products', productRouter)

export default indexRouter
