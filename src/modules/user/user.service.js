

import User, { defaultProfilePicture, defaultPublicId, defaultSecure_url } from '../../DB/models/user.model.js';
import { decrypt, encrypt } from '../../utils/encryption/encryption.js';
import { asyncHandler } from '../../utils/errorHandeling/asyncHandler.js';
import { compare, hash } from '../../utils/hash/hash.js';
import { generateToken, verifyToken } from '../../utils/token/token.js';
import sendEmails from '../../utils/emails/sendEmails.js';
import { verifyEmail } from '../../utils/emails/generateHTML.js';
import path from 'path';
import fs from 'fs';
import cloudinary from './../../utils/file uploading/cloudinary.config.js';


export const profile = asyncHandler(async (req, res, next) => {
    const { user } = req;
    const phone = decrypt({ cipherText: user.phone });
    return res.status(200).json({ ...user, phone });
})

export const updateProfile = asyncHandler(async (req, res, next) => {
    if (req.body.phone) {
        req.body.phone = encrypt({ plainText: req.body.phone });
    }
    const updateProfile = await User.findByIdAndUpdate(req.user._id, { ...req.body, changedAt: Date.now() }, { new: true, runValidators: true },);
    updateProfile
    return res.status(200).json({ success: true, message: "Profile updated successfully", updateProfile });
})


export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, password } = req.body;
    if (!await compare({ plainText: oldPassword, hash: req.user.password })) return next(new Error("Incorrect password", { cause: 400 }));
    const hashPassword = hash({ plainText: password });
    const user = await User.findByIdAndUpdate(req.user._id, { password: hashPassword, changedAt: Date.now() }, { new: true, runValidators: true });
    return res.status(200).json({ success: true, message: "Password updated successfully", user });
})

export const freezeAccount = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user._id, { isDeleted: true, changedAt: Date.now() }, { new: true, runValidators: true });
    return res.status(200).json({ success: true, message: "Password updated successfully", user });
})



export const updateEmail = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return next(new Error("User not found", { cause: 400 }));
    if (!await compare({ plainText: password, hash: user.password })) return next(new Error("Incorrect password", { cause: 400 }));
    user.tempEmail = email;
    await user.save();
    const token = generateToken({ payload: { id: user._id, email } });
    const url = `http://localhost:3000/user/verifySecondEmail/${token}`;
    const html = verifyEmail(url);
    await sendEmails({ to: email, subject: "Verify Email", html });
    return res.status(200).json({ success: true, message: "verification sent successfully" });

})


export const verifySecondEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const { id, email } = verifyToken({ token });
    const user = await User.findById(id);
    if (!user) return next(new Error("User not found", { cause: 400 }));
    user.email = user.tempEmail;
    user.tempEmail = null;
    await user.save();
    return res.status(200).json({ success: true, message: "Email updated successfully" });
})


export const profilePicture = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, { profilePicture: req.file.path }, { new: true, runValidators: true })
    res.status(200).json({ success: true, message: "Profile picture updated successfully", user })
})


export const coverPictures = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    user.coverPictures = req.files.map((file) => file.path);
    await user.save();
    res.status(200).json({ success: true, message: "Cover pictures updated successfully", user })
})


export const deleteProfilePicture = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const imgPath = path.resolve('.', user.profilePicture);
    fs.unlinkSync(imgPath);
    user.profilePicture = defaultProfilePicture;
    await user.save();
    res.status(200).json({ success: true, message: "Profile picture deleted successfully", user })


})



export const profilePictureCloud = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `user/${user._id}/profilePicture` });
    user.profilePictureCloud = { secure_url, public_id };
    await user.save();
    res.status(200).json({ success: true, message: "Profile picture uploaded successfully", user })


})


export const deleteProfilePictureCloud = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id);
    const results = await cloudinary.uploader.destroy(user.profilePictureCloud.public_id);
    if (results.result === 'ok') {
        user.profilePictureCloud = { secure_url: defaultSecure_url, public_id: defaultPublicId };
        await user.save();
        return res.status(200).json({ success: true, message: "Profile picture deleted successfully", user })
    }
})