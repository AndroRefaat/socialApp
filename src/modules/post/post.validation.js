
import joi from 'joi';
import { fileObject } from '../../middlewares/validation.middleware.js';
import { isValidObjectId } from 'mongoose';

export const createPost = joi.object({
    text: joi.string().min(2),
    file: joi.array().items(joi.object(fileObject))
}).or('file', 'text')





export const updatePost = joi.object({
    id: joi.custom(isValidObjectId).required(),
    text: joi.string().min(2),
    file: joi.array().items(joi.object(fileObject))
}).or('file', 'text')



export const freezePost = joi.object({
    id: joi.custom(isValidObjectId).required(),
}).required();


export const unfreezePost = joi.object({
    id: joi.custom(isValidObjectId).required(),
}).required();

export const getSinglePost = joi.object({
    id: joi.custom(isValidObjectId).required(),
}).required();


export const like_unlike = joi.object({
    id: joi.custom(isValidObjectId).required(),
}).required();
