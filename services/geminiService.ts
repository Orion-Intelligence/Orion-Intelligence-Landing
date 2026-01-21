import { GoogleGenAI } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Clinical technical analysis for a specific target.
export const generateThreatReport = async (target: string, type: 'website' | 'ioc'): Promise<string> => {
  try {
    const prompt = `Perform a clinical technical analysis for the following ${type}: ${target}. 
    Focus on structural attributes, known associations, and potential attack vectors. 
    Use neutral, objective language suitable for an OSINT investigator. 
    Avoid marketing hype or alarmist adjectives.
    Include:
    - Target Identification
    - Observed Heuristics
    - Known Entities/Associations
    - Investigative Risk Level (CRITICAL, HIGH, MODERATE, LOW, NEUTRAL)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.3, 
        topP: 0.8,
        maxOutputTokens: 800,
      }
    });

    return response.text || "No intelligence data recovered from remote probe.";
  } catch (error) {
    console.error("Orion Probe Error:", error);
    return "Error: Unable to complete remote probe. Check target syntax or connectivity.";
  }
};

// Brief situational report of global cyber activity.
export const getBriefIntelligenceSummary = async (): Promise<string> => {
  try {
    const prompt = `Provide a concise 3-sentence technical situational report of global cyber activity. Focus on infrastructure-level events, protocol vulnerabilities, or documented threat actor movements. Do not use buzzwords.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 150,
      }
    });
    return response.text || "Intelligence stream synchronization failed.";
  } catch (error) {
    return "Intelligence stream synchronization failed.";
  }
};

// Streaming chat function for AI Nexus component to provide real-time investigative assistance.
export const getStreamingChat = async (message: string) => {
  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: {
        systemInstruction: "You are the Orion AI Nexus, a highly advanced intelligence OS assistant. You provide technical, objective, and clinical analysis for OSINT investigators. Use professional, neutral language. You specialize in threat actors, IOCs, and cyber security infrastructure.",
        temperature: 0.7,
      },
    });
    return response;
  } catch (error) {
    console.error("AINexus Streaming Error:", error);
    throw error;
  }
};
