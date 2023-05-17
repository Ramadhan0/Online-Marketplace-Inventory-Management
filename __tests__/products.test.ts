import request from 'supertest'
import app from '../src/index'

let id: number
let id2: number
let id3: number
let token: string
let user2Token: string
const productName = 'mocProductName'
const newUserEmail = 'mockproductuser@email.com'
const newUserEmail2 = 'mockproductuser2@email.com'

describe('Auth', () => {

    it('should register a user', async () => {
        const user = await request(app)
            .post('/api/inventory/auth/register')
            .send({
                email: newUserEmail,
                name: 'test',
                password: 'test'
            })

        const user2 = await request(app)
            .post('/api/inventory/auth/register')
            .send({
                email: newUserEmail2,
                name: 'test',
                password: 'test'
            })
        token = user.body.data.token
        user2Token = user2.body.data.token
        expect(user.status).toBe(201)
    })

    it('should fail to create product', async () => {
        const product = await request(app)
            .post('/api/inventory/products')
            .send({
                name: productName,
            })
        expect(product.status).toBe(401)
        expect(product.body.message).toEqual('not authorized')
    })

    it('should fail to create product with wrong field', async () => {
        const product = await request(app)
            .post('/api/inventory/products')
            .send({
                name: productName,
                description: 'Product Description',
                pricee: 100,
                quantity: 10
            })
            .set('Authorization', `${token}`)

        expect(product.status).toBe(500)
        expect(product.body.message).toEqual('server error')
    })

    it('should fail to create product with wrong name type', async () => {
        const product = await request(app)
            .post('/api/inventory/products')
            .send({
                name: 2,
                description: 'Product Description',
                price: 100,
                quantity: 10
            })
            .set('Authorization', `${token}`)

        expect(product.status).toBe(500)
        expect(product.body.message).toEqual('server error')
    })

    it('should get all users\'s products', async () => {
        const user2products = await request(app)
            .get('/api/inventory/products/my')
            .set('Authorization', `${user2Token}`)

        expect(user2products.status).toBe(404)
        expect(user2products.body.message).toEqual('products not found')
    })

    it('should create product', async () => {
        const product = await request(app)
            .post('/api/inventory/products')
            .send({
                name: productName,
                description: 'Product Description',
                price: 100,
                quantity: 10
            })
            .set('Authorization', `${token}`)

        const product2 = await request(app)
            .post('/api/inventory/products')
            .send({
                name: `${productName}2`,
                description: 'Product Description',
                price: 100,
                quantity: 10
            })
            .set('Authorization', `${token}`)

        const product3 = await request(app)
            .post('/api/inventory/products')
            .send({
                name: `${productName}3`,
                description: 'Product Description',
                price: 100,
                quantity: 10
            })
            .set('Authorization', `${user2Token}`)

        id = product.body.data.id
        id2 = product2.body.data.id
        id3 = product3.body.data.id

        expect(product.status).toBe(201)
        expect(product.body.message).toEqual('success')
        expect(product.body.data.name).toEqual(productName)
        expect(product.body.data).toHaveProperty('id')
        expect(product.body.data).toHaveProperty('price')
        expect(product.body.data).toHaveProperty('ownerId')
        expect(product.body.data).toHaveProperty('quantity')
        expect(product.body.data).toHaveProperty('description')
    })

    it('should get all products', async () => {
        const product = await request(app)
            .get('/api/inventory/products')

        expect(product.status).toBe(200)
        expect(product.body.message).toEqual('success')
    })

    it('should get all users\'s products', async () => {
        const product = await request(app)
            .get('/api/inventory/products/my')
            .set('Authorization', `${token}`)

        expect(product.status).toBe(200)
        expect(product.body.message).toEqual('success')
    })

    it('should get product  by name', async () => {
        const product = await request(app)
            .get(`/api/inventory/products/single/${productName}`)

        expect(product.status).toBe(200)
        expect(product.body.message).toEqual('success')
    })

    it('should fail to get product by name', async () => {
        const product = await request(app)
            .get('/api/inventory/products/single/wrongProductName')

        expect(product.status).toBe(404)
        expect(product.body.message).toEqual('product not found')
    })

    it('should fail to create product with taken name', async () => {
        const product = await request(app)
            .post('/api/inventory/products')
            .send({
                name: productName,
            })
            .set('Authorization', `${token}`)

        expect(product.status).toBe(400)
        expect(product.body.message).toEqual('product with this name already exist')
    })

    it('should update product', async () => {
        const product = await request(app)
            .put(`/api/inventory/products/${id}`)
            .send({
                name: productName,
            })
            .set('Authorization', `${token}`)

        expect(product.status).toBe(200)
        expect(product.body.message).toEqual('success')
    })

    it('should fail to update product with wrong field name', async () => {
        const product = await request(app)
            .put(`/api/inventory/products/${id}`)
            .send({
                name: productName,
                pricee: 100,
                quantity: 10
            })
            .set('Authorization', `${token}`)

        expect(product.status).toBe(500)
        expect(product.body.message).toEqual('server error')
    })

    it('should fail to update product', async () => {
        const product = await request(app)
            .put(`/api/inventory/products/${id2}`)
            .send({
                name: productName,
            })
            .set('Authorization', `${token}`)

        expect(product.status).toBe(400)
        expect(product.body.message).toEqual('product with this name already exist')
    })

    it('should fail to delete product that does not own', async () => {
        const product = await request(app)
            .delete(`/api/inventory/products/${id3}`)
            .set('Authorization', `${token}`)

        expect(product.status).toBe(400)
        expect(product.body.message).toEqual('unauthorized')
    })

    it('should delete product', async () => {
        const product = await request(app)
            .delete(`/api/inventory/products/${id}`)
            .set('Authorization', `${token}`)

        await request(app)
            .delete(`/api/inventory/products/${id2}`)
            .set('Authorization', `${token}`)

        await request(app)
            .delete(`/api/inventory/products/${id3}`)
            .set('Authorization', `${user2Token}`)

        expect(product.status).toBe(200)
        expect(product.body.message).toEqual('success')
    })

    it('should fail to delete product that does not exist', async () => {
        const product = await request(app)
            .delete(`/api/inventory/products/${id}`)
            .set('Authorization', `${token}`)

        expect(product.status).toBe(404)
        expect(product.body.message).toEqual('product not found')
    })

    it('should fail to delete product that has wrong id value', async () => {
        const product = await request(app)
            .delete('/api/inventory/products/p')
            .set('Authorization', `${token}`)

        expect(product.status).toBe(500)
        expect(product.body.message).toEqual('server error')
    })

    it('should fail to delete product using invalid token', async () => {
        const product = await request(app)
            .delete('/api/inventory/products/p')
            .set('Authorization', 'this is invalid token ')
        expect(product.status).toBe(500)
        expect(product.body.message).toEqual('server error')
    })


    it('should delete user', async () => {
        const product = await request(app)
            .delete(`/api/inventory/auth/remove/${newUserEmail}`)
        await request(app).delete(`/api/inventory/auth/remove/${newUserEmail2}`)

        expect(product.status).toBe(200)
        expect(product.body.message).toEqual('success')
    })

    it('should fail to delete product using invalid token data', async () => {
        const product = await request(app)
            .delete('/api/inventory/products/p')
            .set('Authorization', `${token}`)
        expect(product.status).toBe(404)
        expect(product.body.message).toEqual('user not found')
    })
})
