import crypto from 'crypto'
import { redis } from "@/config/redis";
import ApiError from "@/utils/ApiError";
import httpStatus from 'http-status';
import { seal } from '@/config/jwt';
import { JWT_EXPIRE, JWT_SECRET } from '@/config/config';

/**
 * 
 * 
 * @export
 * @class CardService
 */
export class AuthService {
    private salt = crypto.randomBytes(16).toString('hex')
    
    Create = async (payload: any) => {
        const username = payload.username.toLowerCase()
        const password = crypto.pbkdf2Sync(payload.password, this.salt, 10000, 512, 'sha512').toString('hex')
        try {
            const users = JSON.parse(await redis.get('users'))
            if (!users) {
                await redis.set('users', JSON.stringify([{ username, password, salt: this.salt }]))
            } else {
                const user = users.find((user: any) => user.username === username.toLowerCase());

                if (user) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, `user with username: ${username} already exist!`)
            
                users.push({ username, password, salt: this.salt })
                await redis.set('users', JSON.stringify(users))
            }
            
            return payload
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }

    Login = async (payload: any) => {
        const { username, password } = payload
        
        try {
            const users = JSON.parse(await redis.get('users'))
            if (!users) throw new ApiError(httpStatus.BAD_REQUEST, 'user not found!')

            const user = users.find((user: any) => user.username === username.toLowerCase());
            if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'invalid username or passwordd!')
            
            const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex')
            if (user.password !== hashedPassword) throw new ApiError(httpStatus.BAD_REQUEST, 'invalid username or password!')

            const token = await seal(payload, JWT_SECRET, JWT_EXPIRE)
            delete user.salt

            await redis.set(`${username}_auth`, token, 'EX', 1800)

            return { ...user, token }
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }

    Logout = async (payload: any) => {
        const { username } = payload
        
        try {
            return await redis.del(`${username}_auth`)
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }
}