import { defineConfig } from 'drizzle-kit'

export const DATABASE_URL = 'postgresql://postgres:ying123456@127.0.0.1:5432/ying'

export default defineConfig({
  out: './drizzle',
  schema: './src/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL
  }
})
