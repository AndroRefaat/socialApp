import User, { roles } from "../../DB/models/user.model.js"


export const canChangeRole = async (req, res, next) => {

    const allRoles = Object.values(roles)
    const userReq = req.user
    const targetUser = await User.findById(req.body.userId)

    const userReqRole = userReq.role
    const targetUserRole = targetUser.role

    const reqIndex = allRoles.indexOf(userReqRole)
    const targetIndex = allRoles.indexOf(targetUserRole)

    const canModify = reqIndex <= targetIndex
    if (!canModify) return next(new Error("Unauthorized", { cause: 403 }))
    return next()

}