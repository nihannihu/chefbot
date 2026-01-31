
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });

        // Simple prompt
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        const text = response.text();
        console.log(`SUCCESS: ${modelName} responded: "${text.trim()}"`);
        return true;
    } catch (error) {
        console.error(`FAILURE: ${modelName} failed. Reason: ${error.message}`);
        return false;
    }
}

async function runTests() {
    // Test the ones we saw in the list
    const models = [
        "gemini-2.0-flash",
        "gemini-flash-latest",
        "gemini-pro",
        "gemini-pro-latest"
    ];

    for (const m of models) {
        const success = await testModel(m);
        if (success) {
            console.log(`>>> RECOMMENDED MODEL: ${m} <<<`);
            break;
        }
    }
}

runTests();
