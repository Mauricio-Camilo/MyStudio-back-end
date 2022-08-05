import { Router } from "express";
import authRouter from "./authRouter.js";
import clientRouter from "./clientsRouter.js";

const router = Router();

router.use(authRouter);
router.use(clientRouter);

export default router;