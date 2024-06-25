import * as z from "zod"

export const geminiConfigSchema = z.object({
    globalAPIKey: z.string().min(1),
})