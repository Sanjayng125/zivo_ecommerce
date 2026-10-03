import { Hono } from "hono";
import { verifyOrder } from "../controllers/webhooks.js";

const app = new Hono()

app.post("/webhooks/razorpay", verifyOrder)

export default app
