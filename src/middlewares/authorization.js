const isAuthorized = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return next(new Error("Unauthorized", { cause: 403 }));
        }
        return next();
    }
}

export default isAuthorized;
