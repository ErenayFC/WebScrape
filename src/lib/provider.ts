import { generateText } from "ai";
import type Options from "../types/Options";
import { createOpenAI, type OpenAIProvider } from "@ai-sdk/openai";
import got from "got";
import { createFetch } from "got-fetch";
import type { Schema, z } from "zod";
import { zodToJsonSchema, type JsonSchema7Type } from "zod-to-json-schema";
import { type Page } from "puppeteer";
import cleanup from "../utils/cleanUp";
import Turndown from "turndown";

class Provider {
  options: Options;
  ai!: OpenAIProvider;
  fetch!: typeof globalThis.fetch;
  schema!: JsonSchema7Type;

  constructor(options: Options) {
    this.options = options;
  }

  init() {
    const fetchInstance = got.extend({
      // headers: this.options.ai.externalHeaders
    });

    this.fetch = createFetch(
      fetchInstance
    ) as unknown as typeof globalThis.fetch; // for missing preconnect function

    this.ai = createOpenAI({
      baseURL: this.options.ai.baseUrl,
      apiKey: this.options.ai.apiKey,
      headers: this.options.ai.externalHeaders,
      fetch: this.fetch,
    });

    this.options.general.debug && console.log("Initialized successfully!");
  }

  private async preprocess(page: Page) {
    await page.evaluate(cleanup);
    const body = (await page.evaluate(() => {
      return document.querySelector("body")?.innerHTML;
    })) as string;
    const content = new Turndown().turndown(body);

    return content;
  }

  private stripMarkdownBackticks(text: string): string {
    const codeBlockRegex = /```(?:\w+)?\s*([\s\S]*?)\s*```/g;
    const match = codeBlockRegex.exec(text.trim());
    return match?.[1]?.trim() ?? text.trim();
  }

  generateSchema<T>(schema: z.Schema<T, z.ZodTypeDef, any> | Schema<T>) {
    // TODO: add AI-powered scheme generation with user request
    const schemaJSON = zodToJsonSchema(schema);
    // this.options.general.debug && console.log(schemaJSON);

    this.schema = schemaJSON;

    return this.schema;
  }

  async sendMessage(page: Page, schemaJSON: JsonSchema7Type) {
    const pageContentAsMarkdown = await this.preprocess(page);
    const model = this.ai(this.options.ai.model);

    let { text } = await generateText({
      model,
      messages: [
        { role: "system", content: this.options.ai.systemPrompt },

        {
          role: "user",
          content: `Website: ${page.url}
        Schema: ${JSON.stringify(schemaJSON)}
        Content: ${pageContentAsMarkdown}`,
        },
      ],
    });

    text = this.stripMarkdownBackticks(text);

    this.options.general.debug && console.log(text);

    return text;
  }
}

export default Provider;
