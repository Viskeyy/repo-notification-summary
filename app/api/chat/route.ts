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

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(process.env.OPENAI_BRIDGE as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.APP_KEY}|${process.env.APP_SECRET}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: body.messages,
                temperature: 0.7,
                stream: true,
            }),
        });

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (error) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
