import { model, Schema } from "mongoose"

const otpScheama = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
}, { timestamps: true })

otpScheama.index({ createdAt: 1 }, { expireAfterSeconds: 480 })

const OTP = model('otp', otpScheama)
export default OTP