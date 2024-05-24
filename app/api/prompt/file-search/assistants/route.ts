import { openai } from "@/lib/openai";

export const runtime = "nodejs";
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const assistant = await openai.beta.assistants.create({
        instructions: "You are a helpful assistant.",
        name: "Quickstart Assistant",
        model: "gpt-4-turbo",
        tools: [
            { type: "file_search" },
        ],
    });
    return NextResponse.json({ assistantId: assistant.id });
}