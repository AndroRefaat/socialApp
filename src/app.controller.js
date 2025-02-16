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
const bootstrap = async (app, express) => {
    app.use(cors());
    app.use(morgan("dev"));
    app.use(express.json());
    app.use("/uploads", express.static("uploads"));
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