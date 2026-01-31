import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
        }

        // 1. Raw Fetch to List Models
        // This bypasses the SDK to see exactly what the server says is available
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        let modelsList = [];
        let listError = null;

        try {
            const res = await fetch(listUrl);
            const data = await res.json();
            if (data.models) {
                modelsList = data.models.map((m: any) => m.name);
            } else {
                listError = data;
            }
        } catch (e: any) {
            listError = e.message;
        }

        return NextResponse.json({
            status: "complete",
            apiKeyPrefix: apiKey.substring(0, 5) + "...",
            available_models_count: modelsList.length,
            // Filter for flash/pro models to see if they exist
            relevant_models: modelsList.filter((m: string) => m.includes('gemini')),
            raw_error: listError
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
