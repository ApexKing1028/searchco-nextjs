import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

import { SocksProxyAgent } from 'socks-proxy-agent';
const agent = new SocksProxyAgent('socks5://14aeb2d09ec1a:d120ff77d6@185.112.242.39:12324');

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    httpAgent: agent
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: messages,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}
