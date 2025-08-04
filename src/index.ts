import { z } from "zod";
import config from "./config";
import Provider from "./lib/provider";
import puppeteer from "puppeteer";
import { performance } from "perf_hooks";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const productSchema = z.object({
  top: z
    .array(
      z.object({
        title: z.string(),
        points: z.number(),
        by: z.string(),
        commentsURL: z.string(),
      })
    )
    .length(5)
    .describe("Top 5 stories on Hacker News"),
});

async function scrapeProduct() {
  const browser = await puppeteer.launch({
    headless: !config.general.debug,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const startTime = performance.now();
    const scraper = new Provider(config);
    await scraper.init();
    
    const schemaJSON = scraper.generateSchema(productSchema);
    const page = await browser.newPage();
    
    await page.goto(config.general.urlToScrape, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    
    const result = await scraper.sendMessage(page, schemaJSON);
    const duration = performance.now() - startTime;
    
    config.general.debug && console.log(`Elapsed time: ${duration.toFixed(2)}ms`);
    
    const dirPath = path.join(process.cwd(), config.general.dataJSONPath);
    const fileName = `result_${randomUUID()}.json`;
    const fullPath = path.join(dirPath, fileName);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, result);
    await page.close();
    
  } catch (error) {
    console.error("Scraping failed:", error);
  } finally {
    await browser.close();
  }
}

scrapeProduct();