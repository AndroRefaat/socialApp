
import { Schema, Types, model } from "mongoose";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";


const commentSchema = new Schema({
    post: {
        type: Types.ObjectId,
        ref: "Post",
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required() {
            return this.image ? false : true
        }
    },
    image: { secure_url: String, public_id: String },
    deleteBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: Types.ObjectId,
        ref: "User"
    }],
    comment: {
        type: Types.ObjectId,
        ref: "Comment"
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

commentSchema.virtual("replies", {
    ref: "Comment",
    localField: "_id",
    foreignField: "comment"
})

commentSchema.post('deleteOne', { document: true, query: false }, async function (doc, next) {

    if (doc.image && doc.image.public_id) {
        await cloudinary.uploader.destroy(doc.image.public_id)
    }
    const comment = doc._id
    const replies = await this.constructor.find({ comment })
    if (replies.length) {
        for (const reply of replies) {
            await reply.deleteOne()
        }
    }

})

const Comment = model("Comment", commentSchema);
export default Comment