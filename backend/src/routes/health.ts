import { Hono } from "hono";
import { getHealth } from "../controllers/health.js";

const app = new Hono()

app.get('/', getHealth);

export default app
