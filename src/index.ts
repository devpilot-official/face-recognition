// import { createClient } from 'redis';
import app from './app'
import { APP_PORT, IS_TEST, REDIS_URL } from '@/config/config'
import logger from './config/logger'
import { redis } from './config/redis'

logger.info('App starting...')

redis.on('connect', async() => {
  logger.info('Redis Connected')
  redis.flushall()

  await app.listen(APP_PORT, async () => {
    logger.info(`App listening on ${APP_PORT}`)
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
