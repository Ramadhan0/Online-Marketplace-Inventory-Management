import { PrismaClient } from '@prisma/client'
import express from 'express'
import indexRouter from './routes/index'

const app = express()
const { PORT } = process.env

app.use(express.json())

app.use('/api/inventory/', indexRouter)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`REST API server ready at: http://localhost:${PORT}`))
}


export default app;
