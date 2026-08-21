const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    nom: String,
    narx: Number,
    sotuvdaBor: Boolean,
    email: String,
    password: String,
    role: {
        type: String,
        default: "user"
    }
})

module.exports = mongoose.model("Product", productSchema)