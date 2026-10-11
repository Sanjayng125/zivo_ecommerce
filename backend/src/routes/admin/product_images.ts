import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createProductImage, deleteProductImage, getProductImages, reorderProductImages, updateProductImage } from "../../controllers/admin/product_images.js";
import { customValidationHandler } from "../../lib/validator.js";
import { createProductImageSchema, productImageIdSchema, reorderProductImageSchema, updateProductImageSchema } from "../../schemas/product_images.js";
import { productIdSchema } from "../../schemas/products.js";

const app = new Hono();

app.use('*', zValidator('param', productIdSchema, customValidationHandler))

app.get("/", getProductImages);
app.post("/", zValidator("json", createProductImageSchema, customValidationHandler), createProductImage)
app.patch("/reorder", zValidator("json", reorderProductImageSchema, customValidationHandler), reorderProductImages)
app.patch("/:product_image_id",
    zValidator("param", productImageIdSchema, customValidationHandler),
    zValidator("json", updateProductImageSchema, customValidationHandler),
    updateProductImage
)
app.delete("/:product_image_id", zValidator("param", productImageIdSchema, customValidationHandler), deleteProductImage)


export default app;
