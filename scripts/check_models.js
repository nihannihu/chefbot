
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using the model manager (if available via simpler fetch for listing in v1beta)
    // Actually the SDK doesn't expose listModels easily in the main class in some versions, 
    // but we can try a direct fetch if SDK fails, or just try to instantiate a known working one.
    // Wait, SDK usually doesn't have listModels attached to 'genAI' instance directly in all versions.
    // Let's use a simpler fetch approach to match what the error message suggests: "Call ListModels".

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("AVAILABLE MODELS:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found or error structure:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
