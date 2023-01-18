import express from 'express'
import auth from './auth.route'
import recognition from './image-recognition.route'

const router = express.Router();

router.use('/auth', auth);
router.use('/image', recognition);


export default router
