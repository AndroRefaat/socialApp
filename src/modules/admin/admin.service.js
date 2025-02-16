
import User from '../../DB/models/user.model.js';
import { asyncHandler } from './../../utils/errorHandeling/asyncHandler.js';
import Post from './../../DB/models/post.model.js';


export const getAll = asyncHandler(async (req, res, next) => {
    const results = await Promise.all([User.find(), Post.find()])
    return res.status(200).json({ success: true, results })
})



export const changeRole = asyncHandler(async (req, res, next) => {
    const { userId, role } = req.body;
    const user = await User.findByIdAndUpdate({ _id: userId }, { role }, { new: true });
    return res.status(200).json({ success: true, user })
})