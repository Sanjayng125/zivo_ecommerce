import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { searchProducts } from "../controllers/search.js";
import { customValidationHandler } from "../lib/validator.js";
import { getProductsSchema } from "../schemas/products.js";

const app = new Hono()

app.get("/", zValidator("query", getProductsSchema, customValidationHandler), searchProducts)

export default app
