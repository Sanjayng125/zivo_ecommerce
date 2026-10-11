import { Hono } from "hono";
import { getHomeSections } from "../controllers/home.js";
import { publicRateLimit } from "../middleware/rate-limit.js";

const app = new Hono()

app.use("*", publicRateLimit)

app.get("/", getHomeSections)

export default app
