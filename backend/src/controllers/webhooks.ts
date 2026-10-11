import crypto from "crypto";
import { Context } from "hono";
import { paymentsQueue } from "../lib/queue.js";
import { RAZORPAY_KEY_SECRET } from "../services/razorpay.js";

export const verifyOrder = async (c: Context) => {
    const body = await c.req.text()
    const signature = c.req.header("x-razorpay-signature")
    const expected = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest("hex")

    if (expected !== signature) {
        return c.json({ message: "Invalid signature" }, 400)
    }

    const parsed = JSON.parse(body)

    const paymentSuccess = parsed.event === "payment.captured"
    const paymentFailed = parsed.event === "payment.failed"

    if (paymentSuccess) {
        await paymentsQueue.add("payment.captured", { parsed })
    }
    if (paymentFailed) {
        await paymentsQueue.add("payment.failed", { parsed })
    }

    return c.json({ received: true }, 200)
}
