import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addProductView, createProduct, deleteProduct, getProduct, getProducts, toggleIsActive, updateProduct } from "../controllers/products.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { createProductSchema, getProductsSchema, updateProductSchema } from "../schemas/products.js";
import productVariantsRoutes from "./product_variants.js";

const app = new Hono()

// admin
app.get("/", requireAuth, requireAdmin, zValidator('query', getProductsSchema, customValidationHandler), getProducts);
app.post("/", requireAuth, requireAdmin, zValidator('json', createProductSchema, customValidationHandler), createProduct);
app.patch("/:id/toggle-is-active", requireAuth, requireAdmin, toggleIsActive);
app.patch("/:id", requireAuth, requireAdmin, zValidator('json', updateProductSchema, customValidationHandler), updateProduct);
app.delete("/:id", requireAuth, requireAdmin, deleteProduct);

app.get("/:slug", getProduct);
app.post("/views/:product_id", requireAuth, addProductView)

app.route("/:product_id/variants", productVariantsRoutes);

export default app
