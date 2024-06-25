import * as z from "zod"

export const perplexityConfigSchema = z.object({
    globalAPIKey: z.string().min(1),
})