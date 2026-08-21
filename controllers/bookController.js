const Book = require("../models/Book")
const bcrypt = require("bcrypt")
const { registerSchema } = require("../validators/bookValidator")
const { loginSchema } = require("../validators/bookValidator")
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

exports.registerBook = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: validation.error.issues.map(issue => issue.message)
            })
        }

        const { nom, sahifasi, muallif, Janr, sotuvdaBor, email, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const book = await Book.create({
            nom, sahifasi, muallif, Janr, sotuvdaBor, email, password: hashedPassword
        })

        res.status(201).json({ message: "Book qo'shildi" })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.loginBook = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: "To'gri kiriting!"
            })
        }

        const { email, password } = req.body

        const user = await Book.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Bunday user mavjud emas!"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: "Parol xato!"
            })
        }

        const token = genereteToken(user)

        return res.status(200).json({
            message: "Login qilindi!",
            token
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
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
        const { nomi, muallif, sahifasi, Janr, sotuvdaBor } = req.body

        if (!nomi || !muallif || !sahifasi || !Janr || !sotuvdaBor) {
            return res.status(400).json({
                message: "Barcha ma'lumotlar toldirilishi shart"
            })
        }

        if (sahifasi <= 0) {
            return res.status(400).json({
                message: "Sahifa 0 dan katta bolishi shart"
            })
        }

        const book = await Book.create({
            nomi,
            muallif,
            sahifasi,
            Janr,
            sotuvdaBor
        })

        return res.status(201).json({
            message: "Book qo'shildi"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
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
            { $match: { muallif: "Abdullar Oripov" } },
            { $count: "totalBooks" }
        ])
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.sendBook = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                message: "Email kiritilmagan"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000)

        const otpStore = {}

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