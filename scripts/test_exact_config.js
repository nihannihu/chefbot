const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testExactConfig() {
    console.log("Testing EXACT battle configuration...\n");

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key:", apiKey ? `${apiKey.substring(0, 15)}...` : "MISSING");

    const testPrompt = `You are a cooking battle judge. Create a simple JSON response:
    {
        "agni": {"name": "Spicy Rice", "description": "Hot!", "steps": ["Cook rice", "Add chili"]},
        "veda": {"name": "Healthy Bowl", "description": "Fresh!", "steps": ["Mix greens", "Add quinoa"]},
        "agniRoast": "Your food is bland!",
        "vedaRoast": "Too much oil!",
        "winner": "agni",
        "verdict": "Spice wins!"
    }`;

    try {
        console.log("1. Testing models/gemini-2.5-flash with safety bypass...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "models/gemini-2.5-flash",
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
        });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: testPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        const text = result.response.text();
        console.log("✅ SUCCESS!");
        console.log("Response:", text.substring(0, 100) + "...");

        const parsed = JSON.parse(text);
        console.log("\n✅ JSON is valid!");
        console.log("Winner:", parsed.winner);

    } catch (error) {
        console.error("\n❌ FAILED!");
        console.error("Error Type:", error.constructor.name);
        console.error("Status:", error.status);
        console.error("Message:", error.message);

        if (error.message && error.message.includes("429")) {
            console.error("\n⚠️  RATE LIMIT - Wait 60 seconds and try again");
        } else if (error.message && error.message.includes("404")) {
            console.error("\n⚠️  MODEL NOT FOUND - Check model name");
        } else {
            console.error("\nFull Error:", JSON.stringify(error, null, 2));
        }
    }
}

testExactConfig();
