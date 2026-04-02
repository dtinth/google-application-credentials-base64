import { describe, it, expect, beforeEach, afterEach } from "vite-plus/test";
import fs from "fs";
import path from "path";
import os from "os";

describe("google-application-credentials-base64", () => {
  let tempDir: string;
  let credentialsFilePath: string;

  beforeEach(() => {
    // Create a temporary directory
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gac-"));
    credentialsFilePath = path.join(tempDir, "credentials.json");
  });

  afterEach(() => {
    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
    // Clean up environment variables
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  });

  it("should create credentials file from base64-encoded environment variable", async () => {
    // 1. Generate a JSON object
    const credentialsJson = {
      type: "service_account",
      project_id: "test-project",
      private_key_id: "key123",
      private_key:
        "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA0Z...\n-----END RSA PRIVATE KEY-----\n",
      client_email: "test@test-project.iam.gserviceaccount.com",
      client_id: "123456789",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
    };

    // 2. Stringify and encode to Base64
    const jsonString = JSON.stringify(credentialsJson);
    const base64Encoded = Buffer.from(jsonString).toString("base64");

    // 3. Set environment variables
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsFilePath;
    process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64 = base64Encoded;

    // 4. Verify file does not exist yet
    expect(fs.existsSync(credentialsFilePath)).toBe(false);

    // 5. Dynamically import the module
    await import("./index.js");

    // 6. Assert that the file now exists
    expect(fs.existsSync(credentialsFilePath)).toBe(true);

    // 7. Verify the file contains the correct decoded content
    const fileContent = fs.readFileSync(credentialsFilePath, "utf-8");
    expect(fileContent).toBe(jsonString);
    expect(JSON.parse(fileContent)).toEqual(credentialsJson);
  });
});
