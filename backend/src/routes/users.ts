import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getUser, getUsers, updateUserRole } from "../controllers/users.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { getUsersSchema, updateUserRoleSchema } from "../schemas/users.js";

const app = new Hono();

app.get("/", requireAuth, requireAdmin, zValidator("query", getUsersSchema, customValidationHandler), getUsers);
app.get("/:id", requireAuth, requireAdmin, getUser);
app.patch("/:id/role", requireAuth, requireAdmin, zValidator("json", updateUserRoleSchema, customValidationHandler), updateUserRole);

export default app;
