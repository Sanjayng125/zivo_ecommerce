import { Hono } from "hono";
import { addProductView, getProduct } from "../controllers/products.js";
import { requireAuth } from "../middleware/auth.js";

const app = new Hono()

app.get("/:slug", getProduct);
app.post("/views/:product_id", requireAuth, addProductView)

export default app
