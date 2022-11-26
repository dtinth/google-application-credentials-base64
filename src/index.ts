/**
 * When this package is imported, it writes the service account credentials
 * to `$GOOGLE_APPLICATION_CREDENTIALS`.
 *
 * To use this package, you should set both `GOOGLE_APPLICATION_CREDENTIALS`
 * and `GOOGLE_APPLICATION_CREDENTIALS_BASE64` in your environment variables.
 * If the file does not exist, it will be populated with the contents of
 * `GOOGLE_APPLICATION_CREDENTIALS_BASE64`, base64 decoded.
 *
 * This allows setting the service account credentials via the environment
 * variable, which can be useful in CI and containerized environments.
 *
 * @packageDocumentation
 */

import fs from 'fs'

if (
  process.env.GOOGLE_APPLICATION_CREDENTIALS &&
  process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64 &&
  !fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)
) {
  const data = Buffer.from(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64,
    'base64',
  ).toString()
  fs.writeFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, data, 'utf8')
}

export {}
