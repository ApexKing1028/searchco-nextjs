import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { SocksProxyAgent } from 'socks-proxy-agent';
import { claudeConfigSchema } from "@/lib/validations/claudeConfig"
const agent = new SocksProxyAgent('socks5://14aa439fa63ae:b35b9f9acc@185.101.105.184:12324');

const routeContextSchema = z.object({
    params: z.object({
        userId: z.string(),
    }),
})

export async function PATCH(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        // Validate the route context.
        const { params } = routeContextSchema.parse(context)

        // Ensure user is authentication and has access to this user.
        const session = await getServerSession(authOptions)
        if (!session?.user || params.userId !== session?.user.id) {
            return new Response(null, { status: 403 })
        }

        // Get the request body and validate it.
        const body = await req.json()
        const payload = claudeConfigSchema.parse(body)

        try {

        } catch (error) {
            return new Response("Invalid Claude key", { status: 400, statusText: "Invalid Claude API key" })
        }

        // Update the user.
        await db.claudeConfig.upsert({
            where: {
                userId: session.user.id,
            },
            create: {
                userId: session.user.id,
                ...payload
            },
            update: {
                ...payload
            }
        })
        return new Response(null, { status: 200 })
    } catch (error) {
        console.error(error)
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(null, { status: 500 })
    }
}