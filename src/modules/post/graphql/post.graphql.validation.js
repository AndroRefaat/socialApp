import joi from "joi";

export const postSchema = joi.object({
    id: joi.string().required().min(5)
}).required();