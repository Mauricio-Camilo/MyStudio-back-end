import { Router } from "express";
import { resetDatabase, seedDatabase } from "../controllers/testsController.js";

const testsRouter = Router();

testsRouter.post("/tests/reset", resetDatabase);
testsRouter.post("/tests/seed", seedDatabase);

export default testsRouter;