import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getProduct, getProducts } from "../controllers/products.js";
import { customValidationHandler } from "../lib/validator.js";
import { getProductsSchema } from "../schemas/products.js";

const app = new Hono()

app.get("/", zValidator('query', getProductsSchema, customValidationHandler), getProducts);
app.get("/:slug", getProduct);

export default app
