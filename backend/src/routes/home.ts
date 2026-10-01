import { Hono } from "hono";
import { getHomeSections } from "../controllers/home.js";

const app = new Hono()

app.get("/", getHomeSections)

export default app
