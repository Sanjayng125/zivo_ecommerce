import { Hono } from "hono";
import { cleanupPendingOrders } from "../controllers/internal.js";

const app = new Hono()

app.post("/cleanup-pending-orders", cleanupPendingOrders)

export default app
