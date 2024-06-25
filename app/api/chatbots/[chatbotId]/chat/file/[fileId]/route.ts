import { db } from "@/lib/db";
import { OpenAI } from "openai";
import { z } from "zod";
import { SocksProxyAgent } from 'socks-proxy-agent';
const agent = new SocksProxyAgent('socks5://14aa439fa63ae:b35b9f9acc@185.101.105.184:12324');

const routeContextSchema = z.object({
    params: z.object({
        chatbotId: z.string(),
        fileId: z.string(),
    }),
})

export async function GET(
    request: Request,
    context: z.infer<typeof routeContextSchema>
) {

    const { params } = routeContextSchema.parse(context)

    const chatbotId = params.chatbotId
    const openaiKey = await db.chatbot.findUnique({
        select: {
            openaiKey: true,
        },
        where: {
            id: chatbotId,
        },
    })

    if (!openaiKey) {
        return new Response("Can't find chatbot.", { status: 404 })
    }

    const openai = new OpenAI({
        apiKey: openaiKey.openaiKey,
        httpAgent: agent
    });

    const [file, fileContent] = await Promise.all([
        openai.files.retrieve(params.fileId),
        openai.files.content(params.fileId),
    ]);

    return new Response(fileContent.body, {
        headers: {
            "Content-Disposition": `attachment; filename="${file.filename}"`,
        },
    });
}