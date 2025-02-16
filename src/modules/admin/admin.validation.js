import joi from "joi";
import { isValidObjectId } from "mongoose";
import { roles } from "../../DB/models/user.model.js";

export const changeRole = joi.object({
    userId: joi.custom(isValidObjectId).required(),
    role: joi.string().valid(...Object.values(roles)).required(),
}).required();