export interface AiConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  systemPrompt: string;
  externalHeaders: Record<string, string>;
}

export interface GeneralConfig {
  debug: boolean;
}

export interface Config {
  ai: AiConfig;
  general: GeneralConfig;
}

const ai = {
  apiKey: process.env.API_KEY || "",
  baseUrl: process.env.BASE_URL || "",
  model: process.env.MODEL || "",
  systemPrompt: String(process.env.SYSTEM_PROMPT) || "",
  externalHeaders: {},
};

const general = {
  debug: process.env.DEBUG == "true" || process.env.NODE_ENV !== "production",
  urlToScrape: process.env.URL || "",
  dataJSONPath: process.env.DATA_JSON_PATH || "./data"
};

export default {
  ai,
  general,
};
