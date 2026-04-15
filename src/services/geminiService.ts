import { GoogleGenAI, Modality } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export interface LandmarkData {
  hands: any[];
  face: any[];
  timestamp: number;
}

export async function generateSpeech(text: string, language: "English" | "Tamil"): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
  try {
    const prompt = language === "English" 
      ? `Say cheerfully: ${text}` 
      : `Say clearly in Tamil: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: language === "English" ? 'Kore' : 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
}

export async function translateGestures(
  buffer: LandmarkData[],
  language: "English" | "Tamil"
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set. Please add it to your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
  // We simplify the data to reduce token usage
  // Just take a few samples from the buffer
  const sampledData = buffer.filter((_, i) => i % 15 === 0).map(d => ({
    hands: d.hands.map((h: any, idx: number) => ({
      side: idx === 0 ? "Left" : "Right",
      points: h.map((l: any) => [l.x.toFixed(2), l.y.toFixed(2)])
    })),
    timestamp: d.timestamp - buffer[0].timestamp
  }));

  const prompt = `
    You are an expert sign language interpreter. 
    I will provide you with a sequence of hand landmark coordinates (x, y) captured over a 7-second window.
    Translate these gestures into a professional, natural-sounding sentence in ${language}.
    
    Landmark Data (Time-series):
    ${JSON.stringify(sampledData)}
    
    Context:
    - Coordinates are normalized (0 to 1).
    - Data points are sampled every ~0.5 seconds.
    - Focus on the movement and relative positions of the fingers.
    
    Rules:
    1. Only return the translated sentence.
    2. If the data is unclear, return "Unrecognized gesture."
    3. Do not explain the landmarks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Translation failed.";
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    return "Error in translation.";
  }
}
