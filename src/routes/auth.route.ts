import express from 'express';
import { AuthController } from '@/controllers/AuthController';
import { payloaddValidation } from '@/middlewares/middleware';


const router = express.Router()

const { NewUser, Login, Logout } = new AuthController();

router.post('/', payloaddValidation, NewUser);
router.post('/login', payloaddValidation, Login);
router.post('/logout', Logout);

export default router
