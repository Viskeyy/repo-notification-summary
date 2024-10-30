import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const res = await fetch(process.env.DATA_URL as string);
        if (res) {
            return new NextResponse(res.body, { status: 200 });
        }
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 });
    }
}
