export type OpenAIConfig = {
  apiKey: string
  baseUrl: string
  defaultModel: string
}

export function getOpenAIConfig(): OpenAIConfig {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY")
  return {
    apiKey,
    baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    defaultModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  }
}

