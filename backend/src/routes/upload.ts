import { Hono } from "hono";
import { getUploadAuth } from "../controllers/upload.js";
import { requireAuth } from "../middleware/auth.js";

const app = new Hono()

app.get("/auth", requireAuth, getUploadAuth)

export default app
