import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

// --- CONFIGURATION ---
const MODELS = [
    // Models with available quota (from AI Studio dashboard)
    "models/gemini-3-flash",  // 0/5 RPM - Available!
    "models/gemini-3-17b",  // 0/50 RPM - Available!
    "models/gemini-2.5-flash-lite",  // 2/19 RPM - Has quota
    "models/gemini-3-4b",  // Other models
    "models/gemini-2.5-flash",  // Try anyway (might work)
    "models/gemini-flash-lite-latest",
    "models/gemini-2.0-flash-lite-001",
    "models/gemini-pro-latest"
];

const MASTER_PROMPT = `
You are the 'ChefBot Arena' Engine.
Act as TWO distinct personas to generate a cooking battle.

PERSONA 1: AGNI (The Spice Warlord)
- Style: Hyderabad, Spicy, Aggressive, Loud.
- Likes: Chili, frying, heart-stopping flavor.
- Hates: Bland, boiled, "healthy" food.

PERSONA 2: VEDA (The Wellness Guru)
- Style: California, Vegan-ish, Zen, Preachy.
- Likes: Kale, quinoa, raw ingredients, glowing skin.
- Hates: Grease, processed food, meat.

TASK:
1. Create a unique recipe for Agni using the ingredients.
2. Create a unique recipe for Veda using the ingredients.
3. Write a "Roast" where Agni mocks Veda's recipe (Mean).
4. Write a "Critique" where Veda lectures Agni about his recipe (Preachy).
5. DECIDE A WINNER. 
   IMPORTANT: You are now the "Grand Judge". You must be completely UNBIASED. 
   - Do NOT just pick Agni because he is loud. 
   - Do NOT just pick Veda because she is healthy.
   - Evaluate based on: Creativity of ingredient usage, Feasibility, and "Mouth-feel".
   - Flip a coin if they are equal, but ensure diversity in winners.

OUTPUT JSON:
{
    "agni": { 
        "name": "Recipe Name", 
        "description": "Short description in Agni's voice", 
        "steps": ["Step 1", "Step 2", "Step 3"] 
    },
    "veda": { 
        "name": "Recipe Name", 
        "description": "Short description in Veda's voice", 
        "steps": ["Step 1", "Step 2", "Step 3"] 
    },
    "agniRoast": "Agni's insult towards Veda's recipe",
    "vedaRoast": "Veda's lecture towards Agni's recipe",
    "winner": "agni" or "veda",
    "verdict": "The judge's explanation of why they won (Focus on the food, not the personality)."
}
`;


// --- HELPER FUNCTION ---
async function generateJSON(prompt: string, modelName: string) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({
            model: modelName,
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
        });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        let text = result.response.text();
        text = text.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(text);
    } catch (e: any) {
        // Detailed error logging for debugging
        console.error(`GenJSON Error (${modelName}):`, JSON.stringify(e, null, 2));
        throw e;
    }
}

// --- API ROUTE HANDLER ---
export async function POST(req: Request) {
    const body = await req.json();
    const ingredients = body.ingredients;
    console.log("Battle Request:", ingredients);

    if (!ingredients) return NextResponse.json({ error: "No ingredients" }, { status: 400 });

    try {

        const specificPrompt = `${MASTER_PROMPT}\n\nIngredients: "${ingredients}"`;

        console.log("Generating Battle with Model Fallback Chain...");
        let data;
        let lastError;

        for (const modelName of MODELS) {
            try {
                console.log(`Trying model: ${modelName}...`);
                data = await generateJSON(specificPrompt, modelName);
                break; // Success
            } catch (e: any) {
                console.warn(`${modelName} Failed:`, e.message);
                lastError = e;
            }
        }

        if (!data) {
            console.error("All Models Failed.");
            throw lastError || new Error("All models failed silently");
        }

        console.log("Battle Generated Successfully.");

        return NextResponse.json({
            rounds: [
                {
                    type: 'generate',
                    agni: data.agni,
                    veda: data.veda
                },
                {
                    type: 'critique',
                    agni: { message: data.agniRoast },
                    veda: { message: data.vedaRoast }
                },
                {
                    type: 'verdict',
                    winner: data.winner,
                    reason: data.verdict
                }
            ]
        });

    } catch (error: any) {
        console.error("CRITICAL BATTLE ERROR:", error);

        // --- REALISTIC MOCK FOR DEMO ---
        const ingredientList = ingredients.split(',').map((i: string) => i.trim());
        const mainIngredient = ingredientList[0] || "mystery ingredient";

        return NextResponse.json({
            rounds: [
                {
                    type: 'generate',
                    agni: {
                        name: `Fiery ${mainIngredient} Explosion`,
                        description: `Listen up! I'm taking ${mainIngredient} and turning it into a FLAVOR BOMB that'll make your taste buds scream for mercy!`,
                        steps: [
                            `Heat oil until it's SMOKING hot`,
                            `Toss in ${mainIngredient} with chili flakes, garlic, and ginger`,
                            `Stir-fry at maximum heat until charred`,
                            `Finish with sesame oil and cilantro`,
                            `Serve BLAZING hot!`
                        ]
                    },
                    veda: {
                        name: `Mindful ${mainIngredient} Bowl`,
                        description: `Let's honor the natural essence of ${mainIngredient} with balanced, nourishing preparation that celebrates whole foods.`,
                        steps: [
                            `Gently steam ${mainIngredient} to preserve nutrients`,
                            `Prepare organic quinoa and mixed greens`,
                            `Add avocado, tomatoes, and sprouted seeds`,
                            `Drizzle with olive oil and lemon juice`,
                            `Garnish with microgreens for positive energy`
                        ]
                    }
                },
                {
                    type: 'critique',
                    agni: { message: `Veda, your "bowl" looks like rabbit food! Where's the FLAVOR? You can't just throw leaves in a bowl and call it cooking!` },
                    veda: { message: `Agni, your obsession with heat masks your fear of real ingredients. All that oil is compensation for lack of technique.` }
                },
                {
                    type: 'verdict',
                    winner: Math.random() > 0.5 ? "agni" : "veda",
                    reason: `Both showed creativity with ${mainIngredient}, but ${Math.random() > 0.5 ? "Agni's bold flavors" : "Veda's balanced nutrition"} won the day.`
                }
            ]
        });
    }
}
