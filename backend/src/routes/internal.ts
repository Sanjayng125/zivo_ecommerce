import { Hono } from "hono";
import { cleanupPendingOrders } from "../controllers/internal.js";
import { cronSecretMiddleware } from "../middleware/internal.js";
import { cronRateLimit } from "../middleware/rate-limit.js";

const app = new Hono()

app.post("/cleanup-pending-orders", cronRateLimit, cronSecretMiddleware, cleanupPendingOrders)

export default app
