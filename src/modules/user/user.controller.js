import { Router } from "express";
import * as userService from './user.service.js';
import isAuthenticated from "../../middlewares/authentecation.middleware.js";
import isAuthorized from "../../middlewares/authorization.js";
import { roles } from "../../DB/models/user.model.js";
import * as userValidation from './user.validation.js';
import { validation } from "../../middlewares/validation.middleware.js";
import { fileValidation, upload } from "../../utils/file uploading/multerUpload.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";
const router = Router();

router.get('/profile', isAuthenticated, isAuthorized(roles.user), userService.profile)

router.patch('/updateProfile', isAuthenticated, isAuthorized(roles.user, roles.admin), validation(userValidation.updateProfile), userService.updateProfile)

router.patch('/updatePassword', isAuthenticated, isAuthorized(roles.user, roles.admin), validation(userValidation.updatePassword), userService.updatePassword)

router.delete('/freezeAccount', isAuthenticated, isAuthorized(roles.user, roles.admin), userService.freezeAccount)

router.patch('/updateEmail', isAuthenticated, isAuthorized(roles.user), validation(userValidation.updateEmail), userService.updateEmail)

router.get('/verifySecondEmail/:token', userService.verifySecondEmail)

router.post('/profilePicture', isAuthenticated, upload(fileValidation.images, "uploads/users").single('image'), userService.profilePicture)

router.post('/coverPictures', isAuthenticated, upload(fileValidation.images, "uploads/users").array('images'), userService.coverPictures)

router.delete('/deleteProfilePicture', isAuthenticated, userService.deleteProfilePicture)

router.post('/profilePictureCloud', isAuthenticated, uploadCloud().single('image'), userService.profilePictureCloud)

router.delete('/deleteProfilePictureCloud', isAuthenticated, userService.deleteProfilePictureCloud)
export default router;