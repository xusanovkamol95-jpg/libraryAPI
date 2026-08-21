const jwt = require("jsonwebtoken")

const genereteToken = (data) => {
    return jwt.sign({
        id: data._id,
        role: data.role,
        ism: data.ism,
        nom: data.nom
    },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
}

module.exports = genereteToken