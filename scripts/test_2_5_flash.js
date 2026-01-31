const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testModel() {
    console.log("Testing gemini-2.5-flash...\n");

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent("Say hello in one word");
        console.log("✅ SUCCESS!");
        console.log("Response:", result.response.text());

    } catch (error) {
        console.error("❌ FAILED!");
        console.error("Status:", error.status);
        console.error("Message:", error.message);
        console.error("\nTrying alternative: gemini-exp-1206...");

        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model2 = genAI.getGenerativeModel({ model: "gemini-exp-1206" });

            const result2 = await model2.generateContent("Say hello in one word");
            console.log("✅ gemini-exp-1206 WORKS!");
            console.log("Response:", result2.response.text());

        } catch (error2) {
            console.error("❌ gemini-exp-1206 also failed");
            console.error("Status:", error2.status);
            console.error("Message:", error2.message);
        }
    }
}

testModel();
