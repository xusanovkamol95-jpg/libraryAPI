const express = require("express")
const DBconnect = require("./config/db")
const bookRoutes = require("./Routes/bookRoutes")
const userRoutes = require("./Routes/userRoutes")
const productRoutes = require("./Routes/productsRoutes")
require("dotenv").config();

const app = express();

app.use(express.json())
DBconnect();
app.use("/", bookRoutes, userRoutes, productRoutes)


app.listen(process.env.PORT, () => { console.log(`Server is running on ${process.env.PORT}`) })
