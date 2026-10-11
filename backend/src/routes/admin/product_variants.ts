import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createProductVariant, deleteProductVariant, getProductVariants, updateProductVariant, updateProductVariantStock } from "../../controllers/admin/product_variants.js";
import { customValidationHandler } from "../../lib/validator.js";
import { createProductVariantSchema, productVariantIdSchema, updateProductVariantSchema, updateStockSchema } from "../../schemas/product_variants.js";
import { productIdSchema } from "../../schemas/products.js";

const app = new Hono()

app.use('*', zValidator('param', productIdSchema, customValidationHandler))

app.get("/", getProductVariants)
app.post("/", zValidator("json", createProductVariantSchema, customValidationHandler), createProductVariant)
app.patch("/:product_variant_id/stock",
    zValidator("param", productVariantIdSchema, customValidationHandler),
    zValidator("json", updateStockSchema, customValidationHandler),
    updateProductVariantStock
)
app.patch("/:product_variant_id",
    zValidator("param", productVariantIdSchema, customValidationHandler),
    zValidator("json", updateProductVariantSchema, customValidationHandler),
    updateProductVariant
)
app.delete("/:product_variant_id", zValidator("param", productVariantIdSchema, customValidationHandler), deleteProductVariant)

export default app
