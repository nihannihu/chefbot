const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testAPIKey() {
    console.log("Testing Gemini API Key...\n");

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key Found:", apiKey ? `${apiKey.substring(0, 10)}...` : "MISSING");

    if (!apiKey) {
        console.error("ERROR: GEMINI_API_KEY not found in .env.local");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Test with the simplest model first
        console.log("\n1. Testing gemini-pro...");
        const model1 = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result1 = await model1.generateContent("Say hello");
        console.log("✅ gemini-pro works! Response:", result1.response.text().substring(0, 50));

        // Test with 2.0 flash
        console.log("\n2. Testing gemini-2.0-flash...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result2 = await model2.generateContent("Say hello");
        console.log("✅ gemini-2.0-flash works! Response:", result2.response.text().substring(0, 50));

        console.log("\n✅ API Key is VALID and working!");

    } catch (error) {
        console.error("\n❌ API Error:");
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        console.error("Details:", error.errorDetails);
        console.error("\nFull Error:", JSON.stringify(error, null, 2));
    }
}

testAPIKey();
