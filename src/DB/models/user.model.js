import { Schema, model } from "mongoose";
export const defaultProfilePicture = "uploads//Screenshot 2025-02-12 230055.png"
export const defaultSecure_url = 'https://res.cloudinary.com/dtwkoizpn/image/upload/v1739401332/Screenshot_2025-02-12_230055_trxd6j.png'
export const defaultPublicId = "Screenshot_2025-02-12_230055_trxd6j.png"
export const roles = {
    superadmin: "superadmin",
    admin: "admin",
    user: "user",
}
export const providers = {
    google: "google",
    system: "system"
}
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exists"],
        lowercase: true,
        match: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/
    },
    password: {
        type: String,
        required: (data) => {
            return data?.provider == providers.system ? true : false
        }
    },
    userName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.user
    },
    changedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    image: String,
    provider: { type: String, enum: Object.values(providers), default: providers.system },
    tempEmail: { type: String, default: null },
    profilePicture: { type: String, default: defaultProfilePicture },
    coverPictures: [String],
    profilePictureCloud: {
        secure_url: { type: String, default: defaultSecure_url },
        public_id: { type: String, default: defaultPublicId }
    }
}, { timestamps: true });

const User = model("User", userSchema);
export default User;

