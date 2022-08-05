import { Router } from "express";
import { createInstructor, loginInstructor } from "../controllers/authController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import loginSchema from "../schemas/loginSchema.js";
import signUpSchema from "../schemas/signUpSchema.js";

const authRouter = Router();

authRouter.post("/signup", validateSchema(signUpSchema), createInstructor);
authRouter.post("/signin", validateSchema(loginSchema), loginInstructor);

export default authRouter;