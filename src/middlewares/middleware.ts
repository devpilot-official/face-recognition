import httpStatus from 'http-status';
import { UploadedFile } from 'express-fileupload';
import ApiError from '@/utils/ApiError';
import { NextFunction, Request, Response } from 'express';

export const payloaddValidation = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  const messages = []

  try {
    if (username === "" || typeof username === 'undefined') messages.push('username is required!')
    if (password === "" || typeof password === 'undefined') messages.push('password is required!')

    if (messages.length !== 0) throw new ApiError (httpStatus.BAD_REQUEST, messages)

    next()
  } catch (err) {
    next(err)
  }
}

export const imageUploadPayload = async (req: Request, res: Response, next: NextFunction) => {
  const { annotation } = req.body
  const image = req.files.image as UploadedFile;

  try {
    if (annotation === "" || typeof annotation === 'undefined')throw new ApiError (httpStatus.BAD_REQUEST, 'Please enter annotation for image')
    if (!image || typeof image === 'undefined') throw new ApiError (httpStatus.BAD_REQUEST, 'Please upload an image')

    next()
  } catch (err) {
    next(err)
  }
}