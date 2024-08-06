'use client';
import { marked } from 'marked';
import { useEffect, useState } from 'react';

export default function Home() {
    const [data, setData] = useState<string>('');

    const fetchData = async () => {
        const response = await fetch('http://localhost:3000/api/chat');
        if (response.status !== 200) return;

        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');

        let chunkString = '';

        while (true) {
            const { done, value } = await reader?.read()!;

            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            chunkString += chunk;

            const chunkArray = chunkString.split('\n');

            for (let i = 0; i < chunkArray.length - 1; i++) {
                const line = chunkArray[i].trim();
                if (line.startsWith('data: ')) {
                    const temp = JSON.parse(line.slice(6));
                    const content = temp.choices[0].delta.content;
                    setData((prev) => (content ? prev + content : prev));
                }
            }

            chunkString = chunkArray[chunkArray.length - 1];
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
            <div dangerouslySetInnerHTML={{ __html: marked(data) }}></div>
            111
        </main>
    );
}
