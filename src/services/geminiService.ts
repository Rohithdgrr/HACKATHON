import { GoogleGenAI, Type } from "@google/genai";
import { RoutingResult, ModelStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function routeQuery(query: string, routerId: string): Promise<RoutingResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an LLM Router simulation for HRouter. 
    Given the query: "${query}" and the router strategy: "${routerId}".
    Select the most appropriate model from:
    - qwen2.5-7b (Fast, good for general tasks)
    - llama-3.1-8b (High capability, good for reasoning)
    - mistral-7b (Efficient, good for simple queries)
    - mixtral-8x7b (Large, best for complex coding or long context)
    
    Return a JSON object with:
    - modelId: string
    - modelName: string
    - size: string
    - provider: string
    - reason: string (brief explanation of why this model was chosen for this specific query and router strategy)`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          modelId: { type: Type.STRING },
          modelName: { type: Type.STRING },
          size: { type: Type.STRING },
          provider: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["modelId", "modelName", "size", "provider", "reason"],
      },
    },
  });

  return JSON.parse(response.text);
}

export async function getChatResponse(
  query: string, 
  modelName: string, 
  onChunk?: (chunk: string) => void
): Promise<{ content: string; stats: ModelStats }> {
  const startTime = Date.now();
  const responseStream = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: `You are acting as the LLM model: ${modelName}. 
    Respond to the user query: "${query}". 
    Keep the response concise and helpful.`,
  });

  let fullContent = "";
  for await (const chunk of responseStream) {
    const text = chunk.text || "";
    fullContent += text;
    if (onChunk) onChunk(text);
  }

  const endTime = Date.now();
  const latency = (endTime - startTime) / 1000;
  const tokens = fullContent.split(/\s+/).length * 1.3; // Rough estimate

  return {
    content: fullContent,
    stats: {
      latency,
      tokensPerSecond: tokens / latency,
      costPer1k: modelName.includes('8x7b') ? 0.002 : 0.0005,
      totalTokens: Math.round(tokens)
    }
  };
}
