import { redis } from "@/config/redis";
import { AuthService } from "@/services/AuthService";
import ApiError from "@/utils/ApiError";
import httpStatus from 'http-status';

export class AuthController {
    private authService: AuthService;
    constructor() {
        this.authService = new AuthService();
    }

    /**
     * Create User
     * @route POST /auth
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf AuthController
     */
    NewUser = async (req: any, res: any, next: any) => {
        try {
            const create = await this.authService.Create(req.body)

            res
            .status(httpStatus.CREATED)
            .json({
                code: httpStatus.CREATED,
                message: "User created",
                data: await this.authService.Login(create)
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Login User
     * @route POST /auth/login
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf AuthController
     */
    Login = async (req: any, res: any, next: any) => {
        try {
            const login = await this.authService.Login(req.body)

            res
            .status(httpStatus.OK)
            .json({
                code: httpStatus.OK,
                message: "User login",
                data: login
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Logout User
     * @route POST /auth/logout
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf AuthController
     */
    Logout = async (req: any, res: any, next: any) => {
        try {
            await this.authService.Logout(req.body)
            
            res
            .status(httpStatus.OK)
            .json({
                code: httpStatus.OK,
                message: "User logged out",
                data: null
            });
        } catch (error) {
            next(error);
        }
    }
}