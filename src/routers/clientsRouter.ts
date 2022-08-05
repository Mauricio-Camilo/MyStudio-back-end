import { Router } from "express";
import { createClient } from "../controllers/clientController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { validateToken } from "../middlewares/tokenValidationMiddleware.js";
import clientSchema from "../schemas/clientSchema.js";

const clientRouter = Router();

clientRouter.post("/clients", validateToken, validateSchema(clientSchema), createClient);

export default clientRouter;