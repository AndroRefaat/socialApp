import jwt from "jsonwebtoken";

export const generateToken = ({ payload, signture = process.env.JWT_SECRET, options = {} }) => {
    return jwt.sign(payload, signture, options);
}

export const verifyToken = ({ token, signture = process.env.JWT_SECRET, options = {} }) => {
    return jwt.verify(token, signture, options);
}