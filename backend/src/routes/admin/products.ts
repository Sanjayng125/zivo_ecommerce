import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createProduct, deleteProduct, getProducts, toggleIsActive, updateProduct } from "../../controllers/admin/products.js";
import { customValidationHandler } from "../../lib/validator.js";
import { createProductSchema, getProductsSchema, updateProductSchema } from "../../schemas/products.js";
import productVariantsRoutes from "./product_variants.js";

const app = new Hono()

app.get("/", zValidator('query', getProductsSchema, customValidationHandler), getProducts);
app.post("/", zValidator('json', createProductSchema, customValidationHandler), createProduct);
app.patch("/:id/toggle-is-active", toggleIsActive);
app.patch("/:id", zValidator('json', updateProductSchema, customValidationHandler), updateProduct);
app.delete("/:id", deleteProduct);

app.route("/:product_id/variants", productVariantsRoutes);

export default app
