const jwt = require("jsonwebtoken")

exports.authMiddLeware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({
                message: "Token required"
            })
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}