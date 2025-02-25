import DB from './DB/connection.js';
import authConroller from './modules/auth/auth.controller.js';
import userConroller from './modules/user/user.controller.js';
import postConroller from './modules/post/post.controller.js';
import commentController from './modules/comment/comment.controller.js';
import globalErrorHandler from './utils/errorHandeling/globalErrorHandler.js';
import notFoundHandler from './utils/errorHandeling/notFoundHandler.js';
import adminController from './modules/admin/admin.controller.js';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit'
import helmet from "helmet";
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './app.schema.js';
const bootstrap = async (app, express) => {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 5,
        message: "Too many requests from this IP, please try again later.",
        legacyHeaders: false,
        standardHeaders: true,
    })
    app.use('/graphql', createHandler({
        schema,
        context: (req) => {
            const { authorization } = req.headers;
            return { authorization }
        },
        formatError: (err) => {
            return {
                success: false,
                message: err.originalError.message,
                statusCode: err.originalError?.cause || 500
            }
        }
    }))
    app.use(helmet());
    app.use(cors());
    app.use(morgan("dev"));
    app.use(limiter);
    app.use(express.json());
    app.use("/uploads", express.static("uploads"));
    app.get("/", (req, res) => res.send("Hello World!"));
    await DB();
    app.use('/auth', authConroller);
    app.use('/user', userConroller);
    app.use('/post', postConroller);
    app.use('/comment', commentController);
    app.use('/admin', adminController);
    app.all('*', notFoundHandler)
    app.use(globalErrorHandler)
}

export default bootstrap;