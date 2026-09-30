import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { auth } from './lib/auth.js'

const app = new Hono().basePath("/api");

app.use('*', logger())
app.use('*', cors())

app.get('/health', (c) => c.json({ status: 'ok' }))

app.all("/auth/*", (c) => auth.handler(c.req.raw));

serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Server is running on port: ${info.port ?? 3000}`)
})

