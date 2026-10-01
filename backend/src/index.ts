import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { auth } from './lib/auth.js'
import { HonoVariables } from './types/index.js'

import { errorHandler, notFound } from './middleware/error.js'
import homeRoutes from "./routes/home.js"

const app = new Hono<{ Variables: HonoVariables }>().basePath("/api")

app.use('*', logger())
app.use('*', cors())

app.get('/health', (c) => c.json({ status: 'ok' }))

app.all("/auth/*", (c) => auth.handler(c.req.raw));

app.route("/home", homeRoutes);

app.notFound(notFound)

app.onError(errorHandler)

serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Server is running on port: ${info.port ?? 3000}`)
})

