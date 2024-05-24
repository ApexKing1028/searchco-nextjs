import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const resp = await fetch('https://datasets-server.huggingface.co/rows?dataset=fka%2Fawesome-chatgpt-prompts&config=default&split=train')
    const data = await resp.json()

    return NextResponse.json(JSON.stringify(data.rows.map((item: { row_idx: number, row: { act: string, prompt: string } }) => (
        {
            id: item.row_idx,
            name: item.row.act,
            content: item.row.prompt,
        }
    ))))
}