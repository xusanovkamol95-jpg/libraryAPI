const Book = require("../models/Book")
const bcrypt = require("bcrypt")
const { registerSchema } = require("../validators/bookValidator")
const transporter = require("../config/mail")
const genereteToken = require("../utils/genereteToken")

exports.getBooks = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1)
        const limit = Math.max(Number(req.query.limit) || 5, 1)
        const skip = (page - 1) * limit;

        const [books, totalBooks] = await Promise.all([
            Book.find().skip(skip).limit(limit),
            Book.countDocuments()
        ])


        res.status(200).json({
            books,
            pagination: {
                page, limit, totalBooks, totalPages: Math.ceil(totalBooks / limit),
                hasNextPage: page < Math.ceil(totalBooks / limit),
                hasPreviousPage: page > 1
            }
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("user")

        if (!book) {
            return res.status(404).json({
                message: "Kitob topilmadi!"
            })
        }

        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({
            message: `${error.message}`
        })
    }
}

exports.profile = async (req, res) => {
    res.status(200).json({
        message: "Protected profile",
        user: req.user
    })
}

exports.createBook = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: validation.error.issues.map(issue => issue.message)
            })
        }

        const { nomi, muallifi, sahifasi, Janr, sotuvdaBor, user } = req.body

        const book = await Book.create({
            nomi,
            muallifi,
            sahifasi,
            Janr,
            sotuvdaBor,
            user
        })

        return res.status(201).json(book)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.editBook = async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(book)
}

exports.deleteBook = async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "O'chirildi!" })
}

exports.countBook = async (req, res) => {
    try {
        const result = await Book.aggregate([
            { $match: { muallifi: "Abdullar Oripov" } },
            { $count: "totalBooks" }
        ])
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const otpStore = {}

exports.sendBook = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                message: "Email kiritilmagan"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000)

        otpStore[email] = otp

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP Code",
            text: `Your is ${otp}`
        })

        res.status(200).json({
            message: "OTP jo'natildi",
            otp
        })
    } catch (error) {

        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.verifyBookOTP = (req, res) => {

    const { email, otp } = req.body

    if (!email || !otp) {
        return res.status(400).json({
            message: "Email va OTP kiritilmagan"
        })
    }


    if (otpStore[email] == otp) {
        delete otpStore[email]
        return res.status(200).json({
            message: "OTP verified"
        })
    }

    res.status(400).json({
        message: "Invalid OTP"
    })
}