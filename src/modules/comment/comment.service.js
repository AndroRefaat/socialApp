import { asyncHandler } from "../../utils/errorHandeling/asyncHandler.js";
import Post from './../../DB/models/post.model.js';
import Comment from './../../DB/models/comment.model.js';
import cloudinary from './../../utils/file uploading/cloudinary.config.js';
import { roles } from "../../DB/models/user.model.js";


export const createComment = asyncHandler(async (req, res, next) => {

    const { text } = req.body;
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) return next(new Error("Post not found", { cause: 404 }))
    let image
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.FOLDER_NAME}/users/${post.user}/posts/${post.cloudFolder}/comments`
        })
        image = { secure_url, public_id }
    }
    const comment = await Comment.create({ text, post: postId, user: req.user._id, image })
    res.status(200).json({ success: true, message: "Comment created successfully", comment })
})


export const updateComment = asyncHandler(async (req, res, next) => {
    const { text } = req.body;
    const { id } = req.params;
    const comment = await Comment.findOne({ _id: id, isDeleted: false });
    if (!comment) return next(new Error("Comment not found", { cause: 404 }));
    const post = await Post.findOne({ _id: comment.post, isDeleted: false });
    if (!post) return next(new Error("Post not found", { cause: 404 }));
    if (comment.user.toString() !== req.user._id.toString()) return next(new Error("Unauthorized", { cause: 401 }));
    let image;
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.FOLDER_NAME}/users/${post.user}/posts/${post.cloudFolder}/comments`
        });
        image = { secure_url, public_id };
        if (comment.image && comment.image.public_id) {
            await cloudinary.uploader.destroy(comment.image.public_id);
        }
        comment.image = image;
    }
    comment.text = text ? text : comment.text;
    await comment.save();
    res.status(200).json({ success: true, message: "Comment updated successfully", comment });
});

export const deleteComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comment.findOne({ _id: id, isDeleted: false });
    if (!comment) return next(new Error("Comment not found", { cause: 404 }));

    const post = await Post.findOne({ _id: comment.post, isDeleted: false });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    const commentOwner = comment.user.toString() === req.user._id.toString();
    const postOwner = post.user.toString() === req.user._id.toString();
    const admin = req.user.role == roles.admin;

    if (!commentOwner && !postOwner && !admin) return next(new Error("Unauthorized", { cause: 401 }));

    comment.isDeleted = true;
    comment.deleteBy = req.user._id;
    await comment.save();
    res.status(200).json({ success: true, message: "Comment deleted successfully", comment })

})

export const getComments = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) return next(new Error("Post not found", { cause: 404 }));
    const comments = await Comment.find({
        post: postId, isDeleted: false,
        comment: { $exists: false },
    }).populate("replies")

    return res.status(200).json({ success: true, comments })


})


export const like_unlike = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    const comment = await Comment.findOne({ _id: id, isDeleted: false });
    if (!comment) return next(new Error("Comment not found", { cause: 404 }))

    const userExists = comment.likes.find((user) => user.toString() == userId.toString());
    if (!userExists) {
        comment.likes.push(userId);
        await comment.save();
    } else {
        comment.likes = comment.likes.filter((user) => user.toString() != userId.toString());
        await comment.save();
    }

    return res.status(200).json({ success: true, comment })
})



export const replyComment = asyncHandler(async (req, res, next) => {
    const { postId, id } = req.params;
    const { text } = req.body;
    const comment = await Comment.findOne({ _id: id, post: postId, isDeleted: false });
    if (!comment) return next(new Error("Comment not found", { cause: 404 }));
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    let image;
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.FOLDER_NAME}/users/${post.user}/posts/${post.cloudFolder}/comments/${req.user._id}`
        });
        image = { secure_url, public_id };
    }
    const replyComment = await Comment.create({ text, post: postId, user: req.user._id, comment: id, image })
    return res.status(200).json({ success: true, message: "reply created successfully", replyComment })


})



export const hardDeleteComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) return next(new Error("Comment not found", { cause: 404 }))
    const post = await Post.findOne({ _id: comment.post, isDeleted: false });
    if (!post) return next(new Error("Post not found", { cause: 404 }));
    const commentOwner = comment.user.toString() === req.user._id.toString();
    const postOwner = post.user.toString() === req.user._id.toString();
    const admin = req.user.role == roles.admin;

    if (!commentOwner && !postOwner && !admin) return next(new Error("Unauthorized", { cause: 401 }));
    await comment.deleteOne();
    return res.status(200).json({ success: true, message: "Comment deleted successfully" })
})