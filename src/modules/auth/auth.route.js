import express from 'express';
import * as authMiddleware from '../../middlewares/auth.middleware.js';
import * as authValidation from './auth.validation.js';
import validation from '../../middlewares/validation.middleware.js';
import * as authController from './auth.controller.js';
import checkOtpPurpose from '../../middlewares/checkOtpPurpose.js';
import {
  loginLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
} from '../../middlewares/rateLimiter.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validation(authValidation.registerSchema),
  authController.register,
);
authRouter.post(
  '/send-otp/:purpose',
  otpRequestLimiter,
  checkOtpPurpose,
  authController.sendOtp,
);
authRouter.patch(
  '/verify-email',
  authMiddleware.isAuthenticated,
  authController.verifyEmail,
);
authRouter.post(
  '/login',
  loginLimiter,
  validation(authValidation.loginSchema),
  authController.login,
);
authRouter.post(
  '/verify-otp/:purpose',
  otpVerifyLimiter,
  authController.verifyOtp,
);
authRouter.patch(
  '/reset-password',
  otpVerifyLimiter,
  validation(authValidation.resetPasswordSchema),
  authController.resetPassword,
);

authRouter.post('/logout', authController.logout);

export default authRouter;
