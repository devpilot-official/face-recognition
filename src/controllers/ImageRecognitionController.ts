import httpStatus from 'http-status';
import { redis } from "@/config/redis";
import { ImageRecognitionService } from "@/services/ImageRecognitionService";
import { delay } from '@/utils/utils';
import { UploadedFile } from 'express-fileupload';

export class ImageRecognitionController {
    private imageRecognitionService: ImageRecognitionService;
    constructor() {
        this.imageRecognitionService = new ImageRecognitionService();
    }

    /**
     * Image Upload
     * @route POST /auth
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf ImageRecognitionController
     */
    UploadImage = async (req: any, res: any, next: any) => {
        try {
            const image = req.files.image as UploadedFile
            
            await this.imageRecognitionService.ImageUpload(req)

            await delay(5000)

            res
            .status(httpStatus.CREATED)
            .json({
                code: httpStatus.CREATED,
                message: "Processing Image",
                data: {
                    filename: image.name,
                    annotation: req.body.annotation,
                    status: 'enqueued',
                    faces: '',
                }
            });
        } catch (error) {
            next(error);
        }
    }
}