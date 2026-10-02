import { Hono } from "hono";
import { getCategories, getCategory } from "../controllers/categories.js";

const app = new Hono()

app.get("/", getCategories)
app.get("/:slug", getCategory)

export default app
