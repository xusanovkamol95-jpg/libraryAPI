const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { authMiddLeware } = require("../middlewares/authMiddleware")
const { roleMiddleware } = require("../middlewares/roleMiddleware")

router.get("/users", userController.getUsers)
router.post("/users", authMiddLeware, roleMiddleware("superAdmin"), userController.createUsers)
router.post("/users/register", userController.registerUser)
router.post("/users/login", userController.loginUser)
router.delete("/users/:id", authMiddLeware, roleMiddleware("superAdmin"), userController.deleteUser)
router.post("/users/send-otp", userController.sendOTP)
router.post("/users/verify-otp", userController.verifyUserOTP)
router.get("/users/profile", authMiddLeware, userController.profile)

router.get("/admin", authMiddLeware, roleMiddleware("admin"), userController.admin)
router.get("/superAdmin", authMiddLeware, roleMiddleware("superAdmin"), userController.superAdmin)
router.get("/menejer", authMiddLeware, roleMiddleware("menejer"), userController.menejer)

router.put("/users/:id", authMiddLeware, roleMiddleware("superAdmin"), userController.updateUser)
module.exports = router