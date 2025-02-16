import joi from "joi";
import { generalField } from "../../middlewares/validation.middleware.js";

export const verify = joi.object({
    email: generalField.email.required(),
}).required();

export const register = joi.object({
    email: generalField.email.required(),
    otp: generalField.otp.required(),
    password: generalField.password.required(),
    confirmPassword: generalField.confirmPassword.required(),
    userName: generalField.userName.required(),
    roles: generalField.roles
}).required()

export const forgetPassword = joi.object({
    email: generalField.email.required()
}).required()


export const login = joi.object({
    email: generalField.email.required(),
    password: generalField.password.required(),
}).required()


export const resetPassword = joi.object({
    email: generalField.email.required(),
    otp: generalField.otp.required(),
    password: generalField.password.required(),
    confirmPassword: generalField.confirmPassword.required(),
}).required()

export const newAccessToken = joi.object({
    refreshToken: joi.string().required()
}).required()

export const loginWithGmail = joi.object({
    idToken: joi.string().required()
}).required()

