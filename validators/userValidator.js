const { z } = require("zod")

const registerSchema = z.object({
    ism: z.string().min(3),
    yosh: z.number().min(1),
    email: z.string().email(),
    password: z.string().min(6)
})


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

module.exports = { registerSchema, loginSchema }