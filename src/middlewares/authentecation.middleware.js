import User from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/errorHandeling/asyncHandler.js";
import { verifyToken } from "../utils/token/token.js";
const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return next(new Error("Token is required", { cause: 401 }));
    if (!authorization.startsWith('Bearer')) return next(new Error("invalid Token", { cause: 401 }));
    const token = authorization.split(' ')[1];
    const decoded = verifyToken({ token });
    const user = await User.findById(decoded.id).select("+password +changedAt").lean();
    if (!user) return next(new Error("User not found", { cause: 400 }));
    if (user.changedAt && user.changedAt.getTime() >= decoded.iat * 1000) {
        return next(new Error("Token is expired", { cause: 401 }));
    }
    req.user = user;
    return next();
});


export default isAuthenticated;