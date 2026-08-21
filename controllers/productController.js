const Product = require("../models/Product")
const {productSchema} = require("../validators/productValidator")
const transporter = require("../config/mail")

exports.getProducts = async (req, res) => {
    const products = await Product.find()
    res.json(products)
}

exports.getProductId = async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.status(200).json(product)
}

exports.creatProduct = async (req, res) => {

    const validation = productSchema.safeParse(req.body)

    if (!validation.success) {
        return res.status(400).json({
            message: validation.error.issues.map(issue => issue.message)
        })
    }

    const product = await Product.create(req.body)
    res.status(201).json({ message: "Mahsulot qo'shildi" })
}

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(201).json({
            message: "Mahsulot yangilandi"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        res.status(201).json({
            message: "Mahsulot o'chirildi"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

exports.sendProduct = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                message: "Email kiritilmagan"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000)

        const otpStore = {}

        otpStore[email] = otp;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP Code",
            text: `Your is${otp}`
        })

        res.status(200).json({
            message: "OPT jo'natildi",
            otp
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.verifyProductOTP = (req, res) => {

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