import User, { providers } from '../../DB/models/user.model.js';
import { eventEmitter } from '../../utils/emails/emailEvent.js';
import { compare, hash } from '../../utils/hash/hash.js';
import { generateToken, verifyToken } from '../../utils/token/token.js';
import OTP from './../../DB/models/otp.model.js';
import Randomstring from 'randomstring';
import { subjects } from '../../utils/emails/sendEmails.js';
import { OAuth2Client } from 'google-auth-library';

export const register = async (req, res, next) => {
    const { email, otp } = req.body;
    const otpExist = await OTP.findOne({ email, otp });
    if (!otpExist) return next(new Error("Invalid OTP", { cause: 400 }));
    const user = await User.create({
        ...req.body,
        password: hash({ plainText: req.body.password }),
        isActivated: true
    });
    res.status(200).json({ success: true, message: "Registration successful", user });

};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("User not found", { cause: 400 }));
    if (!user.isActivated) return next(new Error("Account not activated. Please check your email.", { cause: 400 }));
    if (!await compare({ plainText: password, hash: user.password })) {
        return next(new Error("Incorrect password", { cause: 400 }));
    }

    if (user.isDeleted) {
        user.isDeleted = false;
        await user.save();
    }
    return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken: generateToken({
            payload: { id: user._id },
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE
            }
        }),
        refreshToken: generateToken({
            payload: { id: user._id },
            options: {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE
            }
        }),
    });

};


// export const activateAccount = async (req, res, next) => {

//     const { token } = req.params;
//     if (!token) {
//         return next(new Error("Invalid activation link", { cause: 400 }));
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded.email) {
//         return next(new Error("Invalid token", { cause: 400 }));
//     }
//     const user = await User.findOne({ email: decoded.email });
//     if (!user) return next(new Error("User not found", { cause: 400 }));
//     if (user.isActivated) return next(new Error("Account is already activated", { cause: 400 }));
//     user.isActivated = true;
//     await user.save();
//     return res.status(200).json({ success: true, message: "Account activated successfully!" });
// };



export const verify = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) return next(new Error("Email already exists", { cause: 400 }));

    const otp = Randomstring.generate({ length: 5, charset: "alphanumeric" });
    const savedOTP = await OTP.create({ email, otp });
    eventEmitter.emit('sendEmail', email, otp, subjects.register);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
}


export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email, isDeleted: false, isActivated: true });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    const otp = Randomstring.generate({ length: 5, charset: "alphanumeric" });
    const savedOTP = await OTP.create({ email, otp });
    eventEmitter.emit('sendEmail', email, otp, subjects.resetPass);
    res.status(200).json({ success: true, message: "OTP sent successfully" });

}


export const resetPassword = async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, isDeleted: false, isActivated: true });
    if (!user) return next(new Error("User not found", { cause: 400 }));
    const otpExist = await OTP.findOne({ email, otp });
    if (!otpExist) return next(new Error("Invalid OTP", { cause: 400 }));
    user.password = hash({ plainText: req.body.password });
    await user.save();
    res.status(200).json({ success: true, message: "Password reset successful" });
}




export const newAccessToken = async (req, res, next) => {
    const { refreshToken } = req.body;
    const payload = verifyToken({ token: refreshToken });
    const user = await User.findById(payload.id);
    if (!user) return next(new Error("User not found", { cause: 400 }));
    res.status(200).json({
        success: true, message: "New access token generated successfully",
        newAccessToken: generateToken({
            payload: { id: user._id },
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE
            }
        })
    })
}


export const loginWithGmail = async (req, res, next) => {
    const { idToken } = req.body;
    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    }
    const payload = await verify();

    if (!payload.email_verified) return next(new Error("Email is not verified", { cause: 400 }));
    let user = await User.findOne({ email: payload.email });
    if (!user) {
        user = await User.create({
            email: payload.email,
            userName: payload.name,
            image: payload.picture,
            provider: providers.google,
            isActivated: true
        });
    }
    if (user.provider !== providers.google) {
        return next(new Error("invalid provider", { cause: 400 }));
    }

    res.status(200).json({
        success: true, message: "New access token generated successfully",
        newAccessToken: generateToken({
            payload: { id: user._id },
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE
            }
        })
    })
}
