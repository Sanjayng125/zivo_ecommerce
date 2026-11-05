import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createProduct, deleteProduct, getProduct, getProducts, toggleIsActive, updateProduct } from "../../controllers/admin/products.js";
import { customValidationHandler } from "../../lib/validator.js";
import { createProductSchema, getProductsSchema, productIdSchema, productSlugSchema, updateProductSchema } from "../../schemas/products.js";
import productImagesRoutes from "./product_images.js";
import productVariantsRoutes from "./product_variants.js";

const app = new Hono()

app.get("/", zValidator('query', getProductsSchema, customValidationHandler), getProducts);
app.get("/:slug", zValidator("param", productSlugSchema, customValidationHandler), getProduct);
app.post("/", zValidator('json', createProductSchema, customValidationHandler), createProduct);
app.patch("/:product_id/toggle-is-active", zValidator("param", productIdSchema, customValidationHandler), toggleIsActive);
app.patch("/:product_id",
    zValidator("param", productIdSchema, customValidationHandler),
    zValidator('json', updateProductSchema, customValidationHandler),
    updateProduct
);
app.delete("/:product_id", zValidator("param", productIdSchema, customValidationHandler), deleteProduct);

app.route("/:product_id/variants", productVariantsRoutes);
app.route("/:product_id/images", productImagesRoutes);

export default app
