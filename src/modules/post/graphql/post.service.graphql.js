
import Post from './../../../DB/models/post.model.js';

export const allPosts = async (_, args, context) => {
    const posts = await Post.find().populate('user');
    return {
        success: true,
        status: 200,
        results: posts
    }
}


export const onePost = async (_, args, context) => {
    const { id } = args;
    const post = await Post.findById(id).populate('user');
    return {
        success: true,
        status: 200,
        results: post
    }
}