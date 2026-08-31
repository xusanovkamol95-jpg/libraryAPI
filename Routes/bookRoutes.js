const express = require("express")
const router = express.Router()
const bookController = require("../controllers/bookController")
const { authMiddLeware } = require("../middlewares/authMiddleware")
const { roleMiddleware } = require("../middlewares/roleMiddleware")
router.get("/books", bookController.getBooks)

router.get("/books/stats", authMiddLeware, roleMiddleware("admin"), bookController.countBook)

router.post("/books", bookController.createBook)

router.put("/books/:id", bookController.editBook)

router.delete("/books/:id", bookController.deleteBook)

router.post("/books/send", bookController.sendBook)

router.post("/books/verify-otp", bookController.verifyBookOTP)

router.get("/books/profile", authMiddLeware, bookController.profile)

module.exports = router;