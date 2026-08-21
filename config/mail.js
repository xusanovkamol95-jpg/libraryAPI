const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "xusanovkamol95@gmail.com",
        pass: process.env.APP_PASSWORD
    }
})

module.exports = transporter