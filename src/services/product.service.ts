import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = (ownerId?: string) => prisma.products.findMany()
const newProduct = (data: any) => prisma.products.create({ data })
const product = (name: string) => prisma.products.findUnique({ where: { name } })
const productById = (id: string) => prisma.products.findUnique({ where: { id: parseInt(id) } })
const removeProduct = (id: string) => prisma.products.delete({ where: { id: parseInt(id) } })
const editProduct = (id: string, data: object) => prisma.products.update({
    where: { id: parseInt(id) },
    data
})
const userProducts = (ownerId: string) => prisma.products.findMany({
    where: { ownerId: parseInt(ownerId) }
})

export { products, newProduct, product, editProduct, removeProduct, productById, userProducts }
