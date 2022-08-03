import { Router } from "express";
import { createInstructor } from "../controllers/authController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import signUpSchema from "../schemas/signUpSchema.js";

const authRouter = Router();

authRouter.use("/signup", validateSchema(signUpSchema), createInstructor)

export default authRouter;