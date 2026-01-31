import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

const MODELS = [
    "models/gemini-3-flash",
    "models/gemini-3-17b",
    "models/gemini-2.5-flash-lite",
    "models/gemini-3-4b",
    "models/gemini-2.5-flash",
    "models/gemini-flash-lite-latest",
    "models/gemini-2.0-flash-lite-001",
    "models/gemini-pro-latest"
];

const AGNI_SYSTEM_PROMPT = `
  You are 'Agni', a competitive chef from Hyderabad.
  Personality: Aggressive, loud, loves spice, hates bland food. You act like a drill sergeant in the kitchen.
  Cooking Style: You MUST use chili, curry leaves, or pepper in every dish.
  Interaction: If the user suggests a mild ingredient (like cream, ketchup, mayo, bread), make fun of them ruthlessly.
  
  Task: The user will provide a list of ingredients they have.
  1. First, ROAST their ingredients. Be mean but funny.
  2. Then, suggest a "Remix" recipe that saves their meal using your spicy style.
  
  Output Format: JSON
  {
    "roast": "String (The insult)",
    "recipeName": "String (Creative name)",
    "ingredients": ["String"],
    "steps": ["String"],
    "spicinessLevel": "Number 1-10 (If <5, insult them more)"
  }
`;

async function generateRoast(ingredientList: string) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    for (const modelName of MODELS) {
        try {
            console.log(`Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: AGNI_SYSTEM_PROMPT,
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                ]
            });

            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: `Here are my ingredients: ${ingredientList}` }] }],
                generationConfig: { responseMimeType: "application/json" }
            });

            const text = result.response.text();
            return JSON.parse(text);
        } catch (e: any) {
            console.warn(`${modelName} Failed:`, e.message);
        }
    }

    // Fallback mock
    throw new Error("All models failed");
}

export async function POST(req: Request) {
    const { ingredients } = await req.json();

    if (!ingredients) {
        return NextResponse.json({ error: "No ingredients provided!" }, { status: 400 });
    }

    const ingredientList = Array.isArray(ingredients) ? ingredients.join(", ") : ingredients;
    console.log("Roast Request:", ingredientList);

    try {
        const data = await generateRoast(ingredientList);
        console.log("Roast Success!");
        return NextResponse.json(data);
    } catch (error) {
        console.error("All models failed, serving mock roast");

        // Realistic mock roast
        const mainIngredient = ingredientList.split(',')[0]?.trim() || "mystery item";
        return NextResponse.json({
            roast: `${mainIngredient}? SERIOUSLY?! That's what you're bringing to MY kitchen? I've seen better ingredients in a dumpster behind a gas station!`,
            recipeName: `Agni's Emergency ${mainIngredient} Rescue`,
            ingredients: [ingredientList, "chili flakes (LOTS)", "garlic", "curry leaves", "black pepper"],
            steps: [
                `First, accept that your ingredient choices are terrible`,
                `Heat oil until SMOKING - we need to burn away the shame`,
                `Throw in ${mainIngredient} with enough chili to make you cry`,
                `Add garlic, curry leaves, and pray to the spice gods`,
                `Cook until it stops looking sad (if that's even possible)`
            ],
            spicinessLevel: 9
        });
    }
}
