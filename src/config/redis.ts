import { Redis } from 'ioredis'
import { REDIS_PASSWORD, REDIS_PORT, REDIS_URL } from './config';

export const redis = new Redis({ host: `${REDIS_URL}`, port: Number(`${REDIS_PORT}`), password: `${REDIS_PASSWORD}` });

export const setData = async (key: string, data: any) => {
    await redis.set(key, data)
}

export const getData = async (key: string) => {
    return await redis.get(key)
}

export const delData = async (key: string) => {
    await redis.del(key)
}