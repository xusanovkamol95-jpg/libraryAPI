const User = require("../models/User")
const bcrypt = require("bcrypt")
const { registerSchema, loginSchema } = require("../validators/userValidator")
const transporter = require("../config/mail")
const genereteToken = require("../utils/genereteToken")

const otpStore = {}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
        res.json(users)
    } catch (error) {
        res.status(500).json({
            message: `${error.message}`
        })
    }
}

exports.registerUser = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: validation.error.issues.map(issue => issue.message)
            })
        }

        const { ism, yosh, email, password } = req.body
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: "Oldin royxatdan o'tgansiz!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            ism, yosh, email, password: hashedPassword
        })

        res.status(201).json({ message: "User qo'shildi!" })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: "To'g'ri kiriting!"
            })
        }

        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "Foydaluvchi topilmadi!"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                message: "Parol noto'g'ri!"
            })
        }

        const token = genereteToken(user)

        res.status(200).json({
            message: "Login successful",
            token
        })

    } catch (error) {
        return res.status(500).json({
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

exports.admin = async (req, res) => {
    res.status(200).json({
        message: "Admin profil",
        user: req.user
    })
}

exports.superAdmin = async (req, res) => {
    res.status(200).json({
        message: "Super admin profil",
        user: req.user
    })
}

exports.menejer = async (req, res) => {
    res.status(200).json({
        message: "Menejer profil",
        user: req.user
    })
}

exports.createUsers = async (req, res) => {
    try {
        const { password, ...otherData } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password kiritilishi shart"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            ...otherData,
            password: hashedPassword
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({ message: "User qo'shildi!" })

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "User o'chirildi" })
    } catch (error) {
        res.status(500).json({
            message: `${error.message}`
        })

    }
}

exports.updateUser = async (req, res) => {

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (!user) {
            return res.status(404).json({
                message: "User topilmadi"
            })
        }
        res.status(200).json(user)

    } catch (error) {

        res.status(500).json({
            message: error.message

        })
    }
}

exports.sendOTP = async (req, res) => {
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
            message: "OTP jonatildi"
        })


    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: error.message
        })
    }
}

exports.verifyUserOTP = (req, res) => {

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