import { Router } from "express";
import { createClient, getAllClients } from "../controllers/clientController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { validateToken } from "../middlewares/tokenValidationMiddleware.js";
import clientSchema from "../schemas/clientSchema.js";

const clientRouter = Router();

clientRouter.post("/clients", validateToken, validateSchema(clientSchema), createClient);
clientRouter.get("/clients", validateToken, getAllClients);

export default clientRouter;