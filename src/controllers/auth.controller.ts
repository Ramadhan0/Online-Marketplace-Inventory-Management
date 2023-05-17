import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import response from '../utils/response.utils'
import generateToken from '../utils/generateToken.utils'
import { users, newUser, user, removeUser } from '../services/auth.service'
import { OK, NOT_FOUND, INTERNAL_SERVER_ERROR, CREATED, FORBIDDEN } from 'http-status'

const { SALT_ROUNDS, SECRET } = process.env

export const register = async (req: Request, res: Response) => {
    try {
        const salt = bcrypt.genSaltSync(parseInt(SALT_ROUNDS as string))
        const userPassword = bcrypt.hashSync(req.body.password, salt)
        const user = await newUser({ ...req.body, password: userPassword })
        const tokenData = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        const token = generateToken(tokenData, SECRET as string)
        return response(res, 'success', CREATED, {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        })
    } catch (error) {
        return response(res, 'server error', INTERNAL_SERVER_ERROR, error)
    }
}

// login a user
export const login = async (req: Request, res: Response) => {
    const {
        body: { email, password },
    } = req

    const loginUser = await user(email)
    if (!loginUser) return response(res, 'invalid email or password', FORBIDDEN)

    // if (user) {}
    const isPasswordValid = bcrypt.compareSync(password, loginUser.password)

    if (!isPasswordValid) return response(res, 'invalid email or password', FORBIDDEN)

    const tokenData = {
        id: loginUser.id,
        name: loginUser.name,
        email: loginUser.email
    }
    const token = generateToken(tokenData, SECRET as string)

    return response(res, 'logged in successfully', OK, { user: loginUser, token })
}

export const getUsers = async (req: Request, res: Response) => {
    const user = await users()
    return response(res, 'success', OK, user)
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await removeUser(req.params.email)
        return response(res, 'success', OK)
    } catch (error) {
        return response(res, 'server error', INTERNAL_SERVER_ERROR, error)
    }
}
