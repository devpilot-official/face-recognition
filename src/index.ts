// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import "@tensorflow/tfjs-node";

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import { Canvas, Image, ImageData } from "canvas"
import * as path from "path"
import * as faceapi from "@vladmandic/face-api"
import crypto from "crypto";
import app from './app'
import { ADMIN_PASSWORD, ADMIN_USERNAME, APP_PORT, IS_TEST } from '@/config/config'
import logger from './config/logger'
import { redis } from './config/redis'

logger.info('App starting...')

redis.on('connect', async() => {
  logger.info('Redis Connected')
  redis.flushall()

  // creating admin data
  const salt = crypto.randomBytes(16).toString('hex')
  const password = crypto.pbkdf2Sync(ADMIN_PASSWORD, salt, 10000, 512, 'sha512').toString('hex')

  await redis.set('users', JSON.stringify([{ username: ADMIN_USERNAME, password: ADMIN_PASSWORD, salt }]))

  await app.listen(APP_PORT, async () => {
    logger.info(`App listening on ${APP_PORT}`)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(
      path.resolve(__dirname, "../weights")
    );
  })

  logger.info('App started...')
})

// If the Node process ends, close the Mongoose connection (ctrl + c)
process.on('SIGINT', async () => {
  redis.flushall()
  redis.disconnect()
  logger.info('all process has been closed...')
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception: ' + err)
})
