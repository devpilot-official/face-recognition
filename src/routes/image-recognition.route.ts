import express from 'express';
import { ImageRecognitionController } from '@/controllers/ImageRecognitionController';
import { imageUploadPayload, payloaddValidation } from '@/middlewares/middleware';
import { authenticated } from '@/config/jwt';


const router = express.Router()

const { UploadImage } = new ImageRecognitionController();

router.post('/upload', authenticated, imageUploadPayload, UploadImage);

export default router
