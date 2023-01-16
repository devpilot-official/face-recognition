import httpStatus from 'http-status';
import ApiError from '@/utils/ApiError';
import { NextFunction, Request, Response } from 'express';

export const payloaddValidation = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  const messages = []

  try {
    if (username === "" || typeof username === 'undefined') messages.push('username is required!')
    if (password === "" || typeof password === 'undefined') messages.push('password is required!')

    if (messages.length === 0) {
      next()
    } else {
      throw new ApiError (httpStatus.BAD_REQUEST, messages)
    }
  } catch (err) {
    next(err)
  }
}