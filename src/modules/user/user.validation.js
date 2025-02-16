import joi from 'joi';
import { generalField } from '../../middlewares/validation.middleware.js';

export const updateProfile = joi.object({
    userName: generalField.userName,
    password: generalField.password,
}).required();


export const updatePassword = joi.object({
    oldPassword: generalField.password.required(),
    password: generalField.password.not(joi.ref("oldPassword")).required(),
    confirmPassword: generalField.confirmPassword.valid(joi.ref("newPassword")).required(),
}).required();


export const updateEmail = joi.object({
    email: generalField.email.required(),
    password: generalField.password.required(),
}).required();