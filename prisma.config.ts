import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  datasource: {
    url: process.env.POSTGRES_URL || env('POSTGRES_URL'),
  },
})