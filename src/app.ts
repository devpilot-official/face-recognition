import express from 'express'
import helmet from 'helmet'
// import xss from 'xss-clean'
import compression from 'compression'
import cors from 'cors'
import routes from '@/routes'
import { morganSuccessHandler, morganErrorHandler } from '@/config/morgan'
import { IS_TEST, APP_NAME } from '@/config/config'
import httpStatus from 'http-status'
import ApiError from './utils/ApiError'
import { errorHandler } from './middlewares/error'

const app = express();

app.use('/public', express.static(__dirname + '/public'));

if (!IS_TEST) {
  app.use(morganSuccessHandler)
  app.use(morganErrorHandler)
}

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// gzip compression
app.use(compression())

app.use(cors())


app.get('/', (req, res) => {
  res
  .status(httpStatus.OK)
  .json({
    code: httpStatus.OK,
    message: `Welcome to the ${APP_NAME}.`,
    data: {
      name: `${APP_NAME}`
    }
  })
})

app.use(routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// handle error
app.use(errorHandler)

export default app
