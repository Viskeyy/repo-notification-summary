'use client';
// import { marked } from 'marked';
import { useState } from 'react';

const fetchData = async () => {
    const res = await fetch('http://localhost:3000/api/ollama', {
        method: 'POST',
        body: JSON.stringify({
            // prompt: 'Summary the given Github event data',
            prompt: '',
        }),
    });

    const data = await res.json();

    return data.response;
};

export default function Home() {
    const [summaryData, setSummaryData] = useState('');

    const getParsedData = async () => {
        const data = await fetchData();
        console.log(data, '\n\nfetch data');

        // setSummaryData(data);

        // return marked.parse(data);
    };

    // const summaryData = getParsedData();

    const temp = async () => {
        const tt = await getParsedData();
        console.log(tt);
    };

    temp();
    getParsedData();

    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
            {/* <div
                className='prose-light prose prose-sm'
                dangerouslySetInnerHTML={{ __html: marked.parse(summaryData) }}
            /> */}

            {/* {summaryData && <div>{summaryData}</div>} */}
        </main>
    );
}
