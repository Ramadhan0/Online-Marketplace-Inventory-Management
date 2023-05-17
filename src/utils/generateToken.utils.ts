import jwt from 'jsonwebtoken'

const createToken = (user: object, secret: string) => {
    const token = jwt.sign(user, secret, { expiresIn: '1h' })
    return token
}

export default createToken
