const { z } = require("zod")

const productSchema = z.object({
    nom: z.string().min(3),
    narx: z.number().min(1),
    sotuvdaBor: z.boolean(),
    email: z.string().email(),
    password: z.string().min(6)
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

module.exports = { productSchema, loginSchema }