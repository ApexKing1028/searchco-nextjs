import type { NextRequest } from 'next/server'

export const config = {
    runtime: 'edge',
}

export default async function handler(req: NextRequest) {
    const resp = await fetch('https://datasets-server.huggingface.co/rows?dataset=fka%2Fawesome-chatgpt-prompts&config=default&split=train')
    const data = await resp.json()

    return new Response(
        JSON.stringify(data.rows.map((item: { row_idx: number, row: { act: string, prompt: string } }) => (
            {
                id: item.row_idx,
                name: item.row.act,
                content: item.row.prompt,
            }
        ))),
        {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        }
    )
}