const config = require('./config.json');


async function generateQuestion() {
    // Get form data
    const gender = document.getElementById('gender').value;
    const dob = document.getElementById('dob').value;
    const heightFeet = document.getElementById('height-feet').value;
    const heightInches = document.getElementById('height-inches').value;
    const weight = document.getElementById('weight').value;
    const fitnessGoals = Array.from(document.querySelectorAll('input[name="fitness-goals"]:checked')).map(el => el.value);
    const fitnessLevel = document.getElementById('fitness-level').value;
    const duration = document.getElementById('duration').value;

    // Construct question string
    let question = `I am a ${gender}, born on ${dob}, with a height of ${heightFeet}'${heightInches}", weighing ${weight} lbs.`;
    
    if (fitnessGoals.length > 0) {
        question += ` My fitness goals are ${fitnessGoals.join(', ')}.`;
    }

    question += ` I am at a ${fitnessLevel} fitness level and want a fitness plan for ${duration} weeks.`;
    question += ` Make this a day-by-day bulleted workout plan and return it in HTML format. `;

    // Fetch OpenAI response using the content of 'prompt.txt' as userInput
    const answer = await callChatGPT(question);

    sessionStorage.setItem('answer', answer)

    window.location.href = "fitnessPlan.html";
}

async function callChatGPT(promptText) {
    const OPENAI_API_KEY = "INSERT API KEY";
    const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": promptText}],
            temperature: 0.7
        }),
    };

    try {
        const response = await fetch(OPENAI_ENDPOINT, requestOptions);
        
        if (!response.ok) {
            alert(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        alert('There was a problem calling the ChatGPT API: ' + error);
        return null;
    }
}
