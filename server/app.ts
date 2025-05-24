import express, { Application } from 'express'
import dotenvFlow from 'dotenv-flow'
import morgan from 'morgan'
import cors from 'cors'
import connectDB from './db/connect.js'
import auth from './routes/auth.js'
import jobs from './routes/jobs.js'
import users from './routes/users.js'
import reviews from './routes/reviews.js'
import notFound from './middleware/not-found.js'
import errorHandler from './middleware/error-handler.js'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import products from './routes/products.js'

dotenvFlow.config()

const app: Application = express()

// middleware
app.use(express.json())
app.use(cors())
app.use(express.static('./public'))

app.use(morgan('tiny'))
app.use(cookieParser('cookieParser'))
app.use(fileUpload())

// routes
app.use('/api/auth', auth)
app.use('/api/users', users)
app.use('/api/jobs', jobs)
app.use('/api/products', products)
app.use('/api/reviews', reviews)
app.use(notFound)
app.use(errorHandler as any)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI as string)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
