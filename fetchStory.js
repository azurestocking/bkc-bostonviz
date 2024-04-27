let KEY = 'Bearer sk-proj-nslQvif6rPN6DYzdDSOOT3BlbkFJ4d6t8NGdhPTOeOVh21TV'

async function fetchOfficial(landmark, identifier) {
    console.log(identifier);
    const payload = {
        model: "gpt-3.5-turbo",
        messages: [{
            "role": "system",
            "content": `You are a story helper. Prompt will include various information of a landmark in Boston. Your output will be a short introduction based on provided information. Output text should be strictly less than 120 characters (like a SMS message). Be descriptive. Don't mention the name of place as they will show up somewhere else, and is also to save word count. Include historical and cultural significance to make the story engaging.`
        },
            {
                role: 'user',
                content: `${JSON.stringify(landmark)}`,
            },],
        stream: true,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': KEY
            },
            body: JSON.stringify(payload)
        },
        { responseType: "stream" });

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
    if (!reader) return;
    const storyElement = document.getElementById(`storyText${identifier}`);

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        let dataDone = false;
        const arr = value.split('\n');
        arr.forEach((data) => {
            if (data.length === 0) return;
            if (data === 'data: [DONE]') {
                dataDone = true;
                return;
            }
            const json = JSON.parse(data.substring(6));

            if (json.choices[0].delta.content === "") return;
            if (json.choices[0].finish_reason === "stop") {
                dataDone = true;
                return;
            }
            console.log(json.choices[0].delta.content);
            storyElement.innerHTML += json.choices[0].delta.content;
        });
        if (dataDone) break;
    }
}


async function fetchPersonal(landmark) {
    const payload = {
        model: "gpt-3.5-turbo",
        messages: [{
            "role": "system",
            "content": "You are a story helper. Prompt will include a \"name\" of a place or location, a pair of geo-coordinates help you to get context on the town or neighborhood, and a short \"story\" describes personal experience. The inputs are about user's favorite or meaningful place they wanted to propose as a landmark of Boston. Your output will be based on \"story\". Use \"name\" as reference as most of the time they represent a real place around Boston, MA. Output text should be strictly less than 120 characters (like a SMS message). No person's name should be used. Be descriptive. Don't mention the name of place as they will show up somewhere else, and is also to save word count. Include historical and cultural significance to make the story engaging. "
        },
            {
                role: 'user',
                content: `name: ${landmark["name"]}, 
            latitude: ${landmark.lat}, longitude: ${landmark.lon},
            story: "${landmark.story}"
            `,
            },],
        stream: true,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': KEY
        },
        body: JSON.stringify(payload)
    },
        { responseType: "stream" });

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
    if (!reader) return;
    const storyElement = document.getElementById(`storyText${landmark["name"]}`);

    while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { value, done } = await reader.read();
        if (done) break;
        let dataDone = false;
        const arr = value.split('\n');
        arr.forEach((data) => {
            if (data.length === 0) return;
            if (data === 'data: [DONE]') {
                dataDone = true;
                return;
            }
            const json = JSON.parse(data.substring(6));

            if (json.choices[0].delta.content === "") return;
            if (json.choices[0].finish_reason === "stop") {
                dataDone = true;
                return;
            }
            console.log(json.choices[0].delta.content);
            storyElement.innerHTML += json.choices[0].delta.content;
        });
        if (dataDone) break;
    }
}