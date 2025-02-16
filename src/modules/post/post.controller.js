import { Router } from "express";
import isAuthenticated from "../../middlewares/authentecation.middleware.js";
import isAuthorized from "../../middlewares/authorization.js";
import { roles } from "../../DB/models/user.model.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as postValidation from './post.validation.js';
import * as postService from './post.service.js'
import commentRouter from "../comment/comment.controller.js";
const router = Router()
router.use('/:postId/comment', commentRouter)

router.post('/', isAuthenticated, isAuthorized(roles.user), uploadCloud().array('images'), validation(postValidation.createPost), postService.createPost)

router.patch('/:id', isAuthenticated, isAuthorized(roles.user), uploadCloud().array('images'), validation(postValidation.updatePost), postService.updatePost)

router.patch('/:id/freeze', isAuthenticated, isAuthorized(roles.user, roles.admin), validation(postValidation.freezePost), postService.freezePost)

router.patch('/:id/unfreeze', isAuthenticated, isAuthorized(roles.user, roles.admin), validation(postValidation.unfreezePost), postService.unfreezePost)

router.get('/:id', isAuthenticated, isAuthorized(roles.user, roles.admin), validation(postValidation.getSinglePost), postService.getSinglePost)

router.get('/active/allPosts', isAuthenticated, isAuthorized(roles.user, roles.admin), postService.allActivePosts)

router.get('/freezed/allPosts', isAuthenticated, isAuthorized(roles.user, roles.admin), postService.allFreezedPosts)

router.patch('/:id/like-unlike', isAuthenticated, isAuthorized(roles.user), validation(postValidation.like_unlike), postService.like_unlike)




export default router