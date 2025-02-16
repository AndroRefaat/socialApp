import { Router } from "express";
import * as authService from '../auth/auth.service.js';
import { asyncHandler } from '../../utils/errorHandeling/asyncHandler.js';
import { validation } from "../../middlewares/validation.middleware.js";
import * as authValidation from '../auth/auth.validation.js';
const router = Router();
router.post("/verify", validation(authValidation.verify), asyncHandler(authService.verify));
router.post("/register", validation(authValidation.register), asyncHandler(authService.register));
router.post("/login", validation(authValidation.login), asyncHandler(authService.login));
router.post("/forgetPassword", validation(authValidation.forgetPassword), asyncHandler(authService.forgetPassword));
router.post("/resetPassword", validation(authValidation.resetPassword), asyncHandler(authService.resetPassword));
router.post("/newAccessToken", validation(authValidation.newAccessToken), asyncHandler(authService.newAccessToken));
router.post("/loginWithGmail", validation(authValidation.loginWithGmail), asyncHandler(authService.loginWithGmail));



export default router;

