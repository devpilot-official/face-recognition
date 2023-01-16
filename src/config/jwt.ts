/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from './config';
import ApiError from '@/utils/ApiError';
import { redis } from './redis';

/**
 * Generate token based on payload.
 */
export function seal(data: any, secret: string, ttl: number | string): Promise<string> {
  const expiresIn = typeof ttl === 'number' ? `${ttl}s` : ttl;
  return new Promise((resolve, reject) => {
    const claim = data.toJSON ? data.toJSON() : data;
    jwt.sign({ ...claim }, secret, { expiresIn }, (err, sig) => {
      if (err) return reject(err);
      resolve(sig);
    });
  });
}

/**
 * Verifies user provided token
 */
export function unseal(token: string, secret: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, secret, (err, val) => {
        if (err) return reject(err);
        return resolve(val);
      });
    } catch (error) {

    }
  });
}

/**
 * Authenticate logged in user
 */
export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (typeof req.headers.authorization === 'undefined') throw new ApiError(httpStatus.UNAUTHORIZED, 'authentication not provided!')

    const token = req.headers.authorization.split(' ');
    if (!token && token[0] !== 'Bearer') throw new ApiError(httpStatus.UNAUTHORIZED, 'request is not authorized!')
    
    const token_user = await unseal(token[1], JWT_SECRET);
    const user = await redis.get(`${token_user.username}_auth`)

    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'unknown data detected!')

    req.body.username = token_user.username
    next();
  } catch (err) {
    next(err)
  }
}
