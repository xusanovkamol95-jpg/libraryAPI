const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    nomi: String,
    sahifasi: Number,
    muallifi: String,
    Janr: String,
    sotuvdaBor: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Book", bookSchema)

