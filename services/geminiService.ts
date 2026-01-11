
import { GoogleGenAI, Type } from "@google/genai";
import { RepoAnalysis, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeRepo = async (repoUrl: string): Promise<RepoAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this GitHub repository URL: ${repoUrl}. Provide a comprehensive breakdown for a developer looking to contribute.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          structure: { type: Type.ARRAY, items: { type: Type.STRING } },
          techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
          beginnerExplanation: { type: Type.STRING },
          contributionIdeas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING },
                idea: { type: Type.STRING },
              },
              required: ["level", "idea"]
            }
          },
          prompts: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["name", "structure", "techStack", "beginnerExplanation", "contributionIdeas", "prompts"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const generateReadme = async (userData: any, tone: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a highly professional and attractive GitHub Profile README.md for a developer with the following profile: ${JSON.stringify(userData)}. The tone should be ${tone}. Include sections for About Me, Tech Stack, Stats, and Achievements. Use markdown formatting and emojis.`,
  });

  return response.text || "Failed to generate README.";
};

export const chatWithBuddy = async (message: string, context?: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are the OpenVerse AI Buddy, a supportive and encouraging mentor for open-source contributors. Help the user with: ${message}. ${context ? `Context: ${context}` : ""}`,
    config: {
      systemInstruction: "Always be encouraging, reduce imposter syndrome, and provide actionable technical advice."
    }
  });

  return response.text || "I'm here to help! Could you rephrase that?";
};
