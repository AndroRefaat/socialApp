import { Router } from "express";
import isAuthenticated from './../../middlewares/authentecation.middleware.js';
import isAuthorized from './../../middlewares/authorization.js';
import { uploadCloud } from './../../utils/file uploading/multerCloud.js';
import { validation } from './../../middlewares/validation.middleware.js';
import * as commentValidation from './comment.validation.js';
import * as commentService from './comment.service.js';
import { roles } from "../../DB/models/user.model.js";
const router = Router({ mergeParams: true });

router.post('/', isAuthenticated, isAuthorized(roles.user), uploadCloud().single('images'), validation(commentValidation.createComment), commentService.createComment)

router.patch('/:id', isAuthenticated, isAuthorized(roles.user), uploadCloud().single('images'), validation(commentValidation.updateComment), commentService.updateComment)

router.patch('/:id/delete', isAuthenticated, isAuthorized(roles.user, roles.admin), validation(commentValidation.deleteComment), commentService.deleteComment)

router.get('/', isAuthenticated, isAuthorized(roles.user, roles.admin), validation(commentValidation.getComments), commentService.getComments)

router.patch('/:id/like-unlike', isAuthenticated, isAuthorized(roles.user), validation(commentValidation.like_unlike), commentService.like_unlike)

router.post('/:id', isAuthenticated, isAuthorized(roles.user), uploadCloud().single('images'), validation(commentValidation.replyComment), commentService.replyComment)

router.delete('/:id', isAuthenticated, isAuthorized(roles.user, roles.admin), validation(commentValidation.hardDeleteComment), commentService.hardDeleteComment)
export default router