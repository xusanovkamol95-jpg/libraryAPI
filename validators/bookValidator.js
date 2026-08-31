const { z } = require("zod")

const registerSchema = z.object({
    nomi: z.string().min(4),
    sahifasi: z.number().min(1),
    muallifi: z.string().min(3),
    Janr: z.string(),
    sotuvdaBor: z.boolean()
})

module.exports = { registerSchema }
