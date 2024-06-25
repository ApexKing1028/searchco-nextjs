import * as z from "zod"

export const claudeConfigSchema = z.object({
    globalAPIKey: z.string().min(1),
})