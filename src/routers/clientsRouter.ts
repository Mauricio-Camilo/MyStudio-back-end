import { Router } from "express";
import { createClient, deleteClient, getAllClients, updateClient } from "../controllers/clientController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { validateToken } from "../middlewares/tokenValidationMiddleware.js";
import clientSchema from "../schemas/clientSchema.js";
import updateClientSchema from "../schemas/updateClientSchema.js";

const clientRouter = Router();

clientRouter.post("/clients", validateToken, validateSchema(clientSchema), createClient);
clientRouter.get("/clients", validateToken, getAllClients);
clientRouter.delete("/clients/:id", deleteClient);
clientRouter.put("/clients/:id",validateSchema(updateClientSchema), updateClient);

export default clientRouter;