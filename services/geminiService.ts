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
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3, 
        topP: 0.8,
        maxOutputTokens: 800,
        thinkingConfig: { thinkingBudget: 400 },
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
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 150,
        thinkingConfig: { thinkingBudget: 75 },
      }
    });
    return response.text || "Intelligence stream synchronization failed.";
  } catch (error) {
    return "Intelligence stream synchronization failed.";
  }
};

// Start a streaming chat session with Orion Nexus AI.
export const getStreamingChat = async (message: string) => {
  return await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: message,
    config: {
      systemInstruction: "You are Orion Nexus, a high-fidelity threat intelligence AI assistant. You provide clinical, objective, and technical analysis of cyber threats, actors, and infrastructure. Avoid alarmist language. Use technical terminology appropriate for OSINT investigators.",
      temperature: 0.7,
    }
  });
};
