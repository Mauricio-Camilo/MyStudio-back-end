import express, {json} from "express";
import "express-async-errors"; 
import cors from "cors";
import router from "./routers/index.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import testsRouter from "./routers/testsRouter.js";

const app = express();
app.use(json());
app.use(cors());
app.use(router);
app.use(errorHandlerMiddleware);

if (process.env.NODE_ENV === "test") {
	app.use(testsRouter);
}

export default app;
