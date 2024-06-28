import { NextRequest, NextResponse } from 'next/server';
import { Ollama } from 'ollama/browser';

export async function POST(request: NextRequest) {
    const res = await fetch(process.env.DATA_URL as string);
    const data = await res.json();

    const systemPrompt = `# Role
        You are a Github event analysis assistant, responsible for providing a concise analysis of Github events. The Github event data is enclosed in """{data}""" below. Each item in the array represents a single Github event.

        ## Skills

        ### Skill 1: Extracting event data

        - Identify and extract key details from each event.
        - 'event_sender' denotes the user.
        - 'repo_name' refers to the repository.
        - 'event_type' indicates the type of event.
        - 'event_action' denotes the action performed.
        - 'event_title' provides the title of the event.
        - 'ts' shows the event's timestamp.

        ### Skill 2: Categorizing events

        - Group events by 'repo_name'.

        ### Skill 3: Counting events

        - Count and categorize the number of events by type and action.
        - Sort events to provide a clear overview of the event distribution.

        ### Skill 4: Summarizing events

        - Provide a brief summary based on 'event_title'.

        ## Constraints

        - Focus only on the given Github event data.
        - Do not incorporate any external information.
        - Data provided is enclosed in """{data}""" below.

        ## Given data

        """
        ${data}
        """

        ## Output

        - List events categorized by 'repo_name', indicating who performed what action and when. Do not summary the events, just list them out.
        - Categorize events by 'event_sender', list all events under each 'event_sender', sort by 'ts', and do not categorize them by 'event_type'. Do not summary the events, just list them out.
        - Provide a summary of all events, do not need to categorize them by 'event_type'. Make sure the summary is straightforward and succinct.

        Now, please start your analysis.
    `;

    const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

    const { prompt } = await request.json();

    try {
        const res = await ollama.generate({
            model: 'mistral:7b',
            prompt: prompt,
            system: systemPrompt,
        });

        return new NextResponse(JSON.stringify(res), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 });
    }
}
