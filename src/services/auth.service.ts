import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const users = () => prisma.users.findMany()
const newUser = (data: any) => prisma.users.create({ data })
const user = (email: string) => prisma.users.findUnique({ where: { email } })
const removeUser = (email: string) => prisma.users.delete({ where: { email } })
const userById = (id: string) => prisma.users.findUnique({ where: { id: parseInt(id) } })

export { users, newUser, user, userById, removeUser }
