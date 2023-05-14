import { Router } from 'express'
import { checkIfUserExist } from '../middlewares/checkIfUserExist'
import { getUsers, login, register, deleteUser } from '../controllers/auth.controller'

export const authRouter = Router()

authRouter.get('/', getUsers)
authRouter.post('/login', login)
authRouter.delete('/remove/:email', deleteUser)
authRouter.post('/register', checkIfUserExist, register)
