const { z, boolean } = require("zod")

const registerSchema = z.object({
    nom: z.string().min(4),
    sahifasi: z.number().min(1),
    muallif: z.string().min(3),
    Janr: z.string(),
    sotuvdaBor: z.boolean(),
    email: z.string().email(),
    password: z.string().min(6)
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

module.exports = {registerSchema, loginSchema}
