export const ENVIRONMENT = process.env.APP_ENV || 'development'
export const IS_PRODUCTION = ENVIRONMENT === 'production'
export const IS_TEST = ENVIRONMENT === 'test'
export const APP_PORT = Number(process.env.APP_PORT) || 9000
export const REDIS_URL = `${process.env.REDIS_URL}`
export const REDIS_PORT = `${process.env.REDIS_PORT}`
export const REDIS_PASSWORD = `${process.env.REDIS_PASSWORD}`
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRE = Number(process.env.JWT_EXPIRE)

export const APP_NAME = process.env.APP_NAME || 'Face Recognitioon API'
export const APP_URL = process.env.APP_URL || 'http://localhost:9000'
export const FRONT_END_URL = process.env.FRONT_END_URL || 'http://localhost:9001'
