import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
dotenv.config();

const STORAGE_STATE_PATH = path.join(process.cwd(), 'auth.json');

async function globalSetup() {
  const authData = { extraHTTPHeaders: {} };

  const API_KEY_VALUE = process.env.API_KEY_VALUE;
  // Detected API Key scheme: "api_key" (in: header, name: api_key)
  if (API_KEY_VALUE) {
    authData.extraHTTPHeaders['api_key'] = API_KEY_VALUE;
  }

  const OAUTH_ACCESS_TOKEN = process.env.OAUTH_ACCESS_TOKEN;
  // Detected OAuth2 scheme: "petstore_auth"
  if (OAUTH_ACCESS_TOKEN) {
    authData.extraHTTPHeaders['Authorization'] = `Bearer ${OAUTH_ACCESS_TOKEN}`;
  }

  const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME;
  const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;
  // HTTP Basic authentication is not explicitly in the spec's securitySchemes,
  // but included for completeness if desired via environment variables.
  if (BASIC_AUTH_USERNAME && BASIC_AUTH_PASSWORD) {
    const credentials = Buffer.from(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`).toString('base64');
    authData.extraHTTPHeaders['Authorization'] = `Basic ${credentials}`;
  } else if (BASIC_AUTH_USERNAME || BASIC_AUTH_PASSWORD) {
    throw new Error('Both BASIC_AUTH_USERNAME and BASIC_AUTH_PASSWORD must be set for HTTP Basic authentication.');
  }

  if (Object.keys(authData.extraHTTPHeaders).length === 0) {
    throw new Error('No authentication credentials found. Please set API_KEY_VALUE, OAUTH_ACCESS_TOKEN, or BASIC_AUTH_USERNAME/PASSWORD environment variables.');
  }

  fs.writeFileSync(
    STORAGE_STATE_PATH,
    JSON.stringify(authData, null, 2)
  );

  const resultsDir = path.join(process.cwd(), "allure-results");
  const envFilePath = path.join(resultsDir, "environment.properties");

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const envData = [
    `OS=${os.type()} ${os.release()}`,
    `Node=${process.version}`,
    `BaseURL=${process.env.BASE_URL || "https://petstore3.swagger.io/api/v3"}`,
    `Browser=Playwright Default`,
    `Project=PetStore`,
    `Organization=Accion Labs`,
  ].join("\n");

  fs.writeFileSync(envFilePath, envData, "utf-8");
}

export default globalSetup;
