const express = require("express")
const routes = express.Router()
const productController = require("../controllers/productController")


routes.get("/products", productController.getProducts)
routes.post("/products", productController.creatProduct)
routes.get("/products/:id", productController.getProductId)
routes.put("/products/:id", productController.updateProduct)
routes.delete("/products/:id", productController.deleteProduct)
routes.post("/products/send", productController.sendProduct)
routes.post("/products/verify-otp", productController.verifyProductOTP)

module.exports = routes