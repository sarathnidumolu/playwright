import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
dotenv.config();

const STORAGE_STATE_PATH = path.join(process.cwd(), 'auth.json');

async function globalSetup() {
  const authData = { extraHTTPHeaders: {} };

  // Authentication method detected: apiKey (scheme name: api_key)
  const API_KEY_VALUE = process.env.API_KEY_VALUE;
  if (API_KEY_VALUE) {
    authData.extraHTTPHeaders['api_key'] = API_KEY_VALUE;
  }

  // Authentication method detected: OAuth2 (scheme name: petstore_auth)
  const OAUTH_ACCESS_TOKEN = process.env.OAUTH_ACCESS_TOKEN;
  if (OAUTH_ACCESS_TOKEN) {
    authData.extraHTTPHeaders['Authorization'] = `Bearer ${OAUTH_ACCESS_TOKEN}`;
  }

  if (Object.keys(authData.extraHTTPHeaders).length === 0) {
    throw new Error('No authentication credentials found. Please set API_KEY_VALUE or OAUTH_ACCESS_TOKEN environment variables.');
  }

  fs.writeFileSync(
    STORAGE_STATE_PATH,
    JSON.stringify(authData, null, 2)
  );

  const resultsDir = path.join(__dirname, "allure-results");
  const envFilePath = path.join(resultsDir, "environment.properties");

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  const envData = [
    `OS=${os.type()} ${os.release()}`,
    `Node=${process.version}`,
    `BaseURL=${process.env.BASE_URL || "http://localhost:3000"}`,
    `Browser=Playwright Default`,
    `Project=PetStore`,
    `Organization=Accion Labs`,
  ].join("\n");

  fs.writeFileSync(envFilePath, envData, "utf-8");
}

export default globalSetup;
