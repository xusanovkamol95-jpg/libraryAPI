const dns = require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"])
const mongoose = require("mongoose");
require("dotenv").config()

async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE_NAME);
        console.log("Server ulandi!")
    } catch (error) {
        console.log("Serverda muommo bor!", error.message)
        process.exit(1)
    }
}

module.exports = connectDB