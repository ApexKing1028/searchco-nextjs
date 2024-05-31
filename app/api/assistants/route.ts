import { assistantId } from "@/app/assistant/assistant-config";
import { openai } from "@/lib/openai";
export const runtime = "nodejs";

export async function POST(request) {
  const { type, name, instruction } = await request.json();

  if (type === "file") {

    const assistant = await openai.beta.assistants.create({
      instructions: instruction === "" ? "You are a helpful assistant. You must provide the information for questions on the content that you have" : instruction,
      name: "File Content Assistant",
      model: "gpt-4o",
      tools: [
        { type: "file_search" },
      ],
    });
    console.log(assistant)
    return Response.json({ assistantId: assistant.id });
  }
  else if (type === "website") {
    const assistant = await openai.beta.assistants.create({
      instructions: instruction === "" ? "You are a customer service tool for website. You must answer to the questions based on the website content that you have." : instruction,
      name: name,
      model: "gpt-4o",
      tools: [
        { type: "file_search" },
      ],
    });
    return Response.json({ assistantId: assistant.id });
  }
}

export async function DELETE(request) {
  const body = await request.json();
  const assistantId = body.id;

  await openai.beta.assistants.del(assistantId);

  return new Response();
}