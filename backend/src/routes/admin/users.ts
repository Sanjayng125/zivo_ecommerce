import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getUser, getUsers, updateUserRole } from "../../controllers/admin/users.js";
import { customValidationHandler } from "../../lib/validator.js";
import { getUsersSchema, updateUserRoleSchema, userIdSchema } from "../../schemas/users.js";

const app = new Hono();

app.get("/", zValidator("query", getUsersSchema, customValidationHandler), getUsers);
app.get("/:user_id", zValidator("param", userIdSchema, customValidationHandler), getUser);
app.patch("/:user_id/role",
    zValidator("param", userIdSchema, customValidationHandler),
    zValidator("json", updateUserRoleSchema, customValidationHandler),
    updateUserRole
);

export default app;
