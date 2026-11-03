import { Hono } from "hono";
import { verifyOrder } from "../controllers/webhooks.js";

const app = new Hono()

app.post("/razorpay", verifyOrder)

export default app
