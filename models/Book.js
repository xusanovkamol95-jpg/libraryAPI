const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    nomi: String,
    sahifasi: Number,
    muallif: String,
    Janr: String,
    sotuvdaBor: Boolean,
    email: String,
    password: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    role: {
        type: String,
        default: "user"
    }
})

module.exports = mongoose.model("Book", bookSchema)

