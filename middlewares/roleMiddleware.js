exports.roleMiddleware = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Login qilish shart"
            })
        }

        if (req.user.role !== role) {
            return res.status(403).json({
                message: "Kirish man etiladi"
            })
        }
        next()
    }
}