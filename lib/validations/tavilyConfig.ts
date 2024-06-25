import * as z from "zod"

export const tavilyConfigSchema = z.object({
    globalAPIKey: z.string().min(1),
})