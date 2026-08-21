const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    ism: String,
    yosh: Number,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["user", "admin", "superAdmin", "menejer"],
        default: "user"
    }
})

module.exports = mongoose.model("User", userSchema)