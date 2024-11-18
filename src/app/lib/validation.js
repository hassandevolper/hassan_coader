import z from "zod"
// it is use to validate email
export const emailvalidator = z.object({
    email : z.string().email(),
})