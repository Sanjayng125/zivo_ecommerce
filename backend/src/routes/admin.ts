import { Hono } from "hono";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import bannersRoutes from "./admin/banners.js";
import categoriesRoutes from "./admin/categories.js";
import homeRoutes from "./admin/home.js";
import ordersRoutes from "./admin/orders.js";
import productsRoutes from "./admin/products.js";
import usersRoutes from "./admin/users.js";

const admin = new Hono()

admin.use("*", requireAuth, requireAdmin)

admin.route("/products", productsRoutes)
admin.route("/categories", categoriesRoutes)
admin.route("/banners", bannersRoutes)
admin.route("/home", homeRoutes)
admin.route("/orders", ordersRoutes)
admin.route("/users", usersRoutes)

export default admin
