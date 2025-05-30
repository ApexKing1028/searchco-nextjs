import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import OpenAI from "openai"
import { db } from "@/lib/db"

import { SocksProxyAgent } from 'socks-proxy-agent';
const agent = new SocksProxyAgent('socks5://14aa439fa63ae:b35b9f9acc@185.101.105.184:12324');

const routeContextSchema = z.object({
    params: z.object({
        userId: z.string(),
    }),
})

export async function GET(
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

        const openAIConfig = await db.openAIConfig.findUnique({
            select: {
                globalAPIKey: true,
            },
            where: {
                userId: session.user.id,
            }
        })

        if (!openAIConfig?.globalAPIKey) {
            return new Response("Missing OpenAI API key", { status: 400 })
        }

        const openai = new OpenAI({
            apiKey: openAIConfig!.globalAPIKey,
            httpAgent: agent
        })
        const models = await openai.models.list()

        const idList: string[] = models.body.data?.map((item:any) => item.id);

        return new Response(JSON.stringify(idList), { status: 200 })

    } catch (error) {
        console.error(error)
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(null, { status: 500 })
    }
}