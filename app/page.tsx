'use client';
import { Input } from '@/components/input';
import { generateRandomId } from '@/utils/generateRandomId';
import { systemPrompt } from '@/utils/systemPrompt';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

type Message = {
    id: string;
    role: 'system' | 'user' | 'assistant';
    content: string;
};

export default function Home() {
    const messagesRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [webhookData, setWebhookData] = useState<string>('');

    const fetchWebhookData = async () => {
        try {
            const response = await fetch('/api/webhook');
            const data = await response.json();
            setWebhookData(JSON.stringify(data));
        } catch (error) {
            alert('Error fetching data from webhook database. \n Please refresh the page and try again.');
            window.location.reload();
        }
    };

    const submitMessages = async (messages: Message[]) => {
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: messages.map((message) => ({
                        role: message.role,
                        content: message.content,
                    })),
                }),
            });

            if (response.status !== 200) {
                const error = await response.json();
                setMessages([
                    ...messages,
                    { role: 'assistant', content: 'Error: ' + error.message, id: generateRandomId() },
                ]);
                return;
            }

            setMessages([...messages, { role: 'assistant', content: '', id: generateRandomId() }]);

            const reader = response.body?.getReader();
            if (!reader) throw new Error('Response body is not readable');

            let buffer = '';
            let assistantMessage = '';

            const updateMessageContent = (content: string) => {
                setMessages((prevMessages) => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    const updatedMessage = { ...lastMessage, content };
                    return [...prevMessages.slice(0, -1), updatedMessage];
                });
            };

            const processBuffer = () => {
                const lines = buffer.split('\n\n');
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine.startsWith('data: ')) continue;

                    const jsonStr = trimmedLine.replace(/^data: /, '');
                    if (jsonStr === '[DONE]') return true;

                    try {
                        const data = JSON.parse(jsonStr);
                        for (const choice of data.choices) {
                            if (choice.delta?.content) {
                                assistantMessage += choice.delta.content;
                                updateMessageContent(assistantMessage);
                            }
                        }
                    } catch (error) {
                        console.log('JSON parsing error:', error);
                    }
                }
            };

            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value);
                const isDone = processBuffer();
                if (isDone) break;
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onInputSubmit =
        (role: 'user' | 'system') => (event: React.KeyboardEvent<HTMLInputElement>, inputValue: string) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                const newMessage = { role: role, content: inputValue, id: generateRandomId() };

                if (role === 'user') {
                    const tempMessages =
                        messages[messages.length - 1]?.content === inputValue ? messages : [...messages, newMessage];
                    setMessages(tempMessages);
                    submitMessages(tempMessages);
                } else {
                    setMessages([newMessage]);
                    submitMessages([newMessage]);
                }
            }
        };

    useEffect(() => {
        if (messages.length >= 20) {
            alert(`You have reached the maximum number of messages, Please reload the page to clear the messages.`);
            window.location.reload();
        }

        if (messagesRef?.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages.length]);

    useEffect(() => {
        setMessages([{ role: 'system', content: systemPrompt(webhookData), id: generateRandomId() }]);
    }, [webhookData]);

    useEffect(() => {
        fetchWebhookData();
    }, []);

    return (
        <main className='mx-auto flex min-h-screen w-[80vw] flex-col items-center justify-between p-24'>
            <div
                className='h-[calc(100vh-12rem-4rem)] w-full overflow-y-scroll rounded-lg bg-gray-800 p-8'
                ref={messagesRef}
            >
                {messages.map(
                    (message) =>
                        message.role !== 'system' && (
                            <div key={message.id} className={`${message.role === 'user' ? 'text-right' : ''} p-4`}>
                                <p>{message.role}</p>
                                <Markdown className='indent-8 leading-relaxed'>{message.content}</Markdown>
                            </div>
                        ),
                )}
            </div>
            <Input
                label='The maximum number of messages is 20'
                placeholder='Enter your prompt here'
                onKeyDown={onInputSubmit('user')}
                disabled={loading}
            />
        </main>
    );
}
