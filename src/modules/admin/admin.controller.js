import { Router } from "express";
import * as asdminService from './admin.service.js';
import isAuthenticated from "../../middlewares/authentecation.middleware.js";
import isAuthorized from "../../middlewares/authorization.js";
import { roles } from "../../DB/models/user.model.js";
import * as adminValidation from './admin.validation.js';
import { validation } from "../../middlewares/validation.middleware.js";
import { canChangeRole } from "./admin.middleware.js";


const router = Router()

router.get('/', isAuthenticated, isAuthorized(roles.admin, roles.superadmin), asdminService.getAll)

router.post('/', isAuthenticated, isAuthorized(roles.admin, roles.superadmin), validation(adminValidation.changeRole), canChangeRole, asdminService.changeRole)

export default router