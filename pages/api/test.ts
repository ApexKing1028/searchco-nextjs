import { NextApiRequest, NextApiResponse } from 'next';

import { OPENAI_API_HOST } from '@/utils/app/const';
import { cleanSourceText } from '@/utils/server/google';

import { Message } from '@/types/chat';
import { GoogleBody, GoogleSource } from '@/types/google';

import { Readability } from '@mozilla/readability';
import endent from 'endent';
import jsdom, { JSDOM } from 'jsdom';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
        const { type, key } = req.body;

        if (type === "chatgpt") {
            const answerRes = await fetch(`${OPENAI_API_HOST}/v1/chat/completions`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${key}`,
                },
                method: 'POST',
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: 'system',
                            content: "You are a helpful assistant.",
                        },
                        {
                            role: "user",
                            content: "Hello"
                        },
                    ],
                    max_tokens: 1000,
                    temperature: 1,
                    stream: false,
                }),
            });
            res.status(200).json({ status: "success" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error' })
    }
};

export default handler;
