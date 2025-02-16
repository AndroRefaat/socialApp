import { Schema, Types, model } from "mongoose";


const postSchema = new Schema({
    text: {
        type: String,
        minlength: 2
    },
    images: [{ secure_url: String, public_id: String }],
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: Types.ObjectId,
        ref: "User"
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    cloudFolder: {
        type: String,
        unique: true
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

postSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "post",
    localField: "_id"
})

const Post = model("Post", postSchema);
export default Post;