import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getUser, getUsers, updateUserRole } from "../../controllers/admin/users.js";
import { customValidationHandler } from "../../lib/validator.js";
import { getUsersSchema, updateUserRoleSchema } from "../../schemas/users.js";

const app = new Hono();

app.get("/", zValidator("query", getUsersSchema, customValidationHandler), getUsers);
app.get("/:id", getUser);
app.patch("/:id/role", zValidator("json", updateUserRoleSchema, customValidationHandler), updateUserRole);

export default app;
