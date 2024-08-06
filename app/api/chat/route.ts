import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(process.env.OPENAI_BRIDGE as string, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.APP_KEY}|${process.env.APP_SECRET}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: 'Why the sky blue' }],
                temperature: 0.5,
                stream: true,
            }),
        });
        if (response) {
            return new NextResponse(response.body, { status: 200 });
        }
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 });
    }
}
