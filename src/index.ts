import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from './generated/prisma/index.js'
import { mainRouter } from "./routes/index.route.ts"

import dotenv from 'dotenv'

dotenv.config()

const app = new Hono()
export const db = new PrismaClient();

app.get('/', (c) => {
  return c.text('Welcome to Zwap backend!')
})

db.$connect().then(() => {
  console.log("Connected to db.");
}).catch((error) => {
  console.log("Error connecting to the db: ", error);
});

app.route("", mainRouter );

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
