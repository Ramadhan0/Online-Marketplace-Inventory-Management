import request from 'supertest'
import app from '../src/index'

const newUserEmail = 'mockuser@email.com'

describe('Auth', () => {

    it('should fail to login a user', async () => {
        const response = await request(app)
            .post('/api/inventory/auth/login')
            .send({
                email: newUserEmail,
                password: 'test'
            })
        expect(response.status).toBe(403)
        expect(response.body.message).toEqual('invalid email or password')
    })

    it('should fail to register a user', async () => {
        const response = await request(app)
            .post('/api/inventory/auth/register')
            .send({
                email: newUserEmail,
                namee: 'test',
                password: 'test'
            })
        expect(response.status).toBe(500)
        expect(response.body.message).toEqual('server error')
    })

    it('should register a user', async () => {
        const response = await request(app)
            .post('/api/inventory/auth/register')
            .send({
                email: newUserEmail,
                name: 'test',
                password: 'test'
            })
        expect(response.status).toBe(201)
        expect(response.body.message).toEqual('success')
        expect(response.body.data).toHaveProperty('token')
        expect(response.body.data.user.email).toEqual(newUserEmail)
    })

    it('should fail to register a user', async () => {
        const response = await request(app)
            .post('/api/inventory/auth/register')
            .send({
                email: newUserEmail
            })
        expect(response.status).toBe(400)
        expect(response.body.message).toEqual('user with this email already exist')
    })

    it('should fail to register a user', async () => {
        const response = await request(app)
            .post('/api/inventory/auth/register')
            .send({
                emaill: newUserEmail
            })
        expect(response.status).toBe(500)
        expect(response.body.message).toEqual('server error')
    })

    it('should login a user', async () => {
        const response = await request(app)
            .post('/api/inventory/auth/login')
            .send({
                email: newUserEmail,
                name: 'test',
                password: 'test'
            })
        expect(response.status).toBe(200)
        expect(response.body.message).toEqual('logged in successfully')
        expect(response.body.data.user.email).toEqual(newUserEmail)
        expect(response.body.data).toHaveProperty('token')
    })

    it('should fail to login a user with wrong password', async () => {
        const response = await request(app)
            .post('/api/inventory/auth/login')
            .send({
                email: newUserEmail,
                password: 'password'
            })
        expect(response.status).toBe(403)
        expect(response.body.message).toEqual('invalid email or password')
    })
})

describe('user', () => {
    it('should get all users', async () => {
        const response = await request(app)
            .get('/api/inventory/auth')

        expect(response.status).toBe(200)
        expect(response.body.message).toEqual('success')
    })

    it('should delete user', async () => {
        const response = await request(app)
            .delete(`/api/inventory/auth/remove/${newUserEmail}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toEqual('success')
    })

    it('should fail to delete user', async () => {
        const response = await request(app)
            .delete(`/api/inventory/auth/remove/${newUserEmail}`)
        expect(response.status).toBe(500)
        expect(response.body.message).toEqual('server error')
    })
})
