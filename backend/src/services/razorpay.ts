import Razorpay from "razorpay"

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

export const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })

