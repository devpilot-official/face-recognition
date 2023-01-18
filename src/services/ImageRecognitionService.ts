import { Request } from 'express';
import { UploadedFile } from "express-fileupload";
import * as faceapi from "@vladmandic/face-api";
import { Canvas, createCanvas, loadImage } from "canvas";
import { redis } from "@/config/redis";
import ApiError from "@/utils/ApiError";
import httpStatus from 'http-status';

/**
 * 
 * 
 * @export
 * @class ImageRecognitionService
 */
export class ImageRecognitionService {

    ImageUpload = async (req: Request) => {
        const { annotation, username } = req.body
        const image = req.files.image as UploadedFile
        let userImages;

        try {

            const pulledRec = JSON.parse(await redis.get(username))

            if(pulledRec) userImages = [...pulledRec]

            const uploadeImage = await loadImage(image.data)
            const canvas = createCanvas(uploadeImage.width, uploadeImage.height)
            canvas.getContext("2d").drawImage(uploadeImage, 0, 0)
            
            const detections = await faceapi.detectAllFaces(canvas as any)

            console.log(detections.length)

            const data = {
                filename: image.name,
                annotation,
                status: 'enqueued',
                faces: detections.length,
            }

            if (!userImages) {
                await redis.set(username, JSON.stringify([data]))
            } else {
                userImages.push(data)
                await redis.set(username, JSON.stringify(userImages))
            }
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }
}