import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client. API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the ADLTrack Care Copilot, an AI assistant for professional caregivers. 
Your goal is to provide safety guidance, procedural steps for care tasks (e.g., lifting, hygiene), and documentation help.

CRITICAL SAFETY RULES:
1. You are NOT a doctor. Do not diagnose conditions or prescribe medications.
2. If a query suggests a medical emergency (chest pain, unconsciousness, severe fall), IMMEDIATELY instruct the user to call 911/Emergency Services.
3. Keep responses concise, encouraging, and focused on "Standard Operating Procedures" for elderly care.
4. If asked about specific patient medical history, remind the user to check the official Care Plan in the app.
`;

export const getCopilotResponse = async (
  userMessage: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Optimized for speed and basic reasoning
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balanced creativity and precision
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please check your connection.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently having trouble connecting to the safety database. Please use your training protocols.";
  }
};