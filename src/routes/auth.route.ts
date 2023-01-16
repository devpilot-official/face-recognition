import express from 'express';
import { AuthController } from '@/controllers/AuthController';
import { payloaddValidation } from '@/middlewares/middleware';
import { authenticated } from '@/config/jwt';


const router = express.Router()

const { GetSingleUser, NewUser, Login, Logout } = new AuthController();

router.get('/', authenticated, GetSingleUser);

router.post('/', payloaddValidation, NewUser);
router.post('/login', payloaddValidation, Login);
router.post('/logout', Logout);

export default router
