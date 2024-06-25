import * as z from "zod"

export const uniqueNameSchema = z.object({
    uniqueName: z.string().min(3, {
        message: "Unique name must be at least 3 characters.",
    }),
})