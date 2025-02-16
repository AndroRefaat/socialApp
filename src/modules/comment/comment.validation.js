
import joi from 'joi';
import { isValidObjectId } from 'mongoose';
import { fileObject } from '../../middlewares/validation.middleware.js';


export const createComment = joi.object({
    postId: joi.custom(isValidObjectId).required(),
    text: joi.string().min(2),
    file: joi.array().items(joi.object(fileObject))
}).or('file', 'text')



export const updateComment = joi.object({
    id: joi.custom(isValidObjectId).required(),
    text: joi.string().min(2),
    file: joi.array().items(joi.object(fileObject))
}).or('file', 'text')



export const deleteComment = joi.object({
    id: joi.custom(isValidObjectId).required(),
}).required();



export const getComments = joi.object({
    postId: joi.custom(isValidObjectId).required(),
}).required();


export const like_unlike = joi.object({
    id: joi.custom(isValidObjectId).required(),
}).required();


export const replyComment = joi.object({
    id: joi.custom(isValidObjectId).required(),
    postId: joi.custom(isValidObjectId).required(),
    text: joi.string().min(2),
    file: joi.array().items(joi.object(fileObject))
}).or('file', 'text')



export const hardDeleteComment = joi.object({
    id: joi.custom(isValidObjectId).required(),
}).required();