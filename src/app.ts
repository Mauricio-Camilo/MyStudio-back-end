import express, {json} from "express";
import "express-async-errors"; 
import cors from "cors";
import router from "./routers/index.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

const app = express();
app.use(json());
app.use(cors());
app.use(router);
app.use(errorHandlerMiddleware);

export default app;

// DATABASE_URL=postgres://postgres:Mau8126705@localhost:5432/mystudio
// DATABASE_URL=postgres://wdnatjlxjhewke:46617dc5b303694973a984457c1e88421a2dad9d723ae3fbb7fcdd94a00e3fa0@ec2-3-213-228-206.compute-1.amazonaws.com:5432/d3v1fjbcpe1dv6

