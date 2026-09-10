import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";

const API_URL =
  "https://api.parse.bot/scraper/c9d4d699-5bca-49af-a878-144ad05b0f5f/get_cities";

async function fetchCities() {
  try {
    if (!process.env.PARSE_BOT_API_KEY) {
      throw new Error("PARSE_BOT_API_KEY is missing from the .env file");
    }

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "X-API-Key": process.env.PARSE_BOT_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    console.log(JSON.stringify(result, null, 2));

    await mkdir("data", { recursive: true });

    await writeFile(
      "data/bookmyshow-cities.txt",
      JSON.stringify(result, null, 2),
      "utf8"
    );

    console.log("\nSaved to data/bookmyshow-cities.txt");
  } catch (error) {
    console.error("Could not fetch cities:", error.message);
  }
}

fetchCities();