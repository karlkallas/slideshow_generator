import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Using Nano Banana Pro (gemini-3-pro-image-preview) for high quality
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const images: string[] = [];

    for (const part of parts) {
      // Check if part has inline data (image)
      if ('inlineData' in part && part.inlineData) {
        const { mimeType, data } = part.inlineData;
        // Return as data URL for direct use in img src
        const dataUrl = `data:${mimeType};base64,${data}`;
        images.push(dataUrl);
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: "No image generated. The model may have returned text only." },
        { status: 500 }
      );
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image" },
      { status: 500 }
    );
  }
}

