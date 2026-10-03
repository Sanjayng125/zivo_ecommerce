import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { auth } from './lib/auth.js'
import { HonoVariables } from './types/index.js'

import { errorHandler, notFound } from './middleware/error.js'
import addressesRoutes from "./routes/addresses.js"
import cartRoutes from "./routes/cart.js"
import categoriesRoutes from "./routes/categories.js"
import checkoutRoutes from "./routes/checkout.js"
import homeRoutes from "./routes/home.js"
import internalRoutes from "./routes/internal.js"
import ordersRoutes from "./routes/orders.js"
import productsRoutes from "./routes/products.js"
import profileRoutes from "./routes/profile.js"
import searchRoutes from "./routes/search.js"
import webhooksRoutes from "./routes/webhooks.js"
import wishlistRoutes from "./routes/wishlist.js"

const app = new Hono<{ Variables: HonoVariables }>().basePath("/api")

app.use('*', logger())
app.use('*', cors())

app.get('/health', (c) => c.json({ status: 'ok' }))

app.all("/auth/*", (c) => auth.handler(c.req.raw));

app.route("/home", homeRoutes);
app.route("/categories", categoriesRoutes);
app.route("/products", productsRoutes);
app.route("/search", searchRoutes);
app.route("/cart", cartRoutes);
app.route("/addresses", addressesRoutes);
app.route("/wishlist", wishlistRoutes);
app.route("/profile", profileRoutes);
app.route("/checkout", checkoutRoutes);
app.route("/orders", ordersRoutes);
app.route("/webhooks", webhooksRoutes);
app.route("/internal", internalRoutes);

app.notFound(notFound)

app.onError(errorHandler)

serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Server is running on port: ${info.port ?? 3000}`)
})

