import { nanoid } from "nanoid";
import { asyncHandler } from "../../utils/errorHandeling/asyncHandler.js";
import cloudinary from './../../utils/file uploading/cloudinary.config.js';
import Post from "../../DB/models/post.model.js";
import { roles } from "../../DB/models/user.model.js";
import { populate } from "dotenv";




export const createPost = asyncHandler(async (req, res, next) => {
    const { text } = req.body;
    let cloudFolder = nanoid();
    let images = []
    if (req.files.length) {
        cloudFolder = nanoid()
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
                { folder: `${process.env.FOLDER_NAME}/users/${req.user._id}/posts/${cloudFolder}` }
            )
            images.push({ secure_url, public_id })
        }
    }
    const post = await Post.create({ text, images, cloudFolder, user: req.user._id })
    res.status(200).json({ success: true, message: "Post created successfully", post })
})




export const updatePost = asyncHandler(async (req, res, next) => {
    const { text } = req.body;
    const { id } = req.params;
    const post = await Post.findOne({ _id: id, user: req.user._id })
    if (!post) return next(new Error("Post not found", { cause: 404 }))
    let images = []
    if (req.files.length) {
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
                { folder: `${process.env.FOLDER_NAME}/users/${req.user._id}/posts/${post.cloudFolder}` }
            )
            images.push({ secure_url, public_id })
        }
        if (post.images.length) {
            for (const image of post.images) {
                await cloudinary.uploader.destroy(image.public_id)
            }
        }
        post.text = text ? text : post.text;
        post.images = images;
        await post.save();
    }
    res.status(200).json({ success: true, message: "Post updated successfully", post })
})


export const freezePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return next(new Error("Post not found", { cause: 404 }))
    if (post.user.toString() == req.user._id.toString()) {
        post.isDeleted = true;
        post.deletedBy = req.user._id;
        await post.save();
    }
    return res.status(200).json({ success: true, message: "Post freezed successfully" })

})


export const unfreezePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate({ _id: id, isDeleted: true, deletedBy: req.user._id }, {
        isDeleted: false,
        $unset: { deletedBy: 0 }
    },
        { new: true, runValidators: true }
    );
    if (!post) return next(new Error("Post not found", { cause: 404 }))
    return res.status(200).json({ success: true, message: "Post unfreezed successfully" })
})

export const getSinglePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findOne({ _id: req.params.id, isDeleted: false })
        .populate({
            path: 'user',
            select: "userName profilePictureCloud.secure_url"
        })
        .populate({
            path: 'comments',
            select: "text image createdAt",
            populate: {
                path: 'user',
                select: "userName profilePictureCloud.secure_url"
            }
        });

    if (!post) return next(new Error("Post not found", { cause: 404 }));
    return res.status(200).json({ success: true, post });
});


export const allActivePosts = asyncHandler(async (req, res, next) => {
    let posts;
    if (req.user.role == roles.admin) {
        posts = await Post.find({ isDeleted: false }).populate({
            path: 'user',
            select: "userName profilePictureCloud.secure_url"
        })
    }
    else if (req.user.role == roles.user) {
        posts = await Post.find({ isDeleted: false, user: req.user._id }).populate({
            path: 'user',
            select: "userName profilePictureCloud.secure_url"
        })
    }
    res.status(200).json({ success: true, posts })
})


export const allFreezedPosts = asyncHandler(async (req, res, next) => {
    let posts;
    if (req.user.role == roles.admin) {
        posts = await Post.find({ isDeleted: true }).populate({
            path: 'user',
            select: "userName profilePictureCloud.secure_url"
        })
    }
    else if (req.user.role == roles.user) {
        posts = await Post.find({ isDeleted: true, user: req.user._id }).populate({
            path: 'user',
            select: "userName profilePictureCloud.secure_url"
        })
    }
    res.status(200).json({ success: true, posts })
})


export const like_unlike = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findOne({ _id: id, isDeleted: false });
    if (!post) return next(new Error("Post not found", { cause: 404 }))

    const userExists = post.likes.find((user) => user.toString() == userId.toString());
    if (!userExists) {
        post.likes.push(userId);
        await post.save();
    } else {
        post.likes = post.likes.filter((user) => user.toString() != userId.toString());
        await post.save();
    }

    const postPopulated = await Post.findById(id).populate({
        path: 'user',
        select: "userName profilePictureCloud.secure_url"
    })
    return res.status(200).json({ success: true, post: postPopulated })
})