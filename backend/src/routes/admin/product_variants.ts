import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createProductVariant, deleteProductVariant, getProductVariants, updateProductVariant, updateProductVariantStock } from "../../controllers/admin/product_variants.js";
import { customValidationHandler } from "../../lib/validator.js";
import { createProductVariantSchema, productVariantsSchema, updateProductVariantSchema, updateStockSchema } from "../../schemas/product_variants.js";

const app = new Hono()

app.use('*', zValidator('param', productVariantsSchema, customValidationHandler))

app.get("/", getProductVariants)
app.post("/", zValidator("json", createProductVariantSchema, customValidationHandler), createProductVariant)
app.patch("/:id/stock", zValidator("json", updateStockSchema, customValidationHandler), updateProductVariantStock)
app.patch("/:id", zValidator("json", updateProductVariantSchema, customValidationHandler), updateProductVariant)
app.delete("/:id", deleteProductVariant)

export default app
