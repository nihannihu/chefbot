const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function quickTest() {
    console.log("Quick API Key Test...\n");

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

        const result = await model.generateContent("Say OK");
        console.log("✅ API Key Works!");
        console.log("Response:", result.response.text());

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

quickTest();
