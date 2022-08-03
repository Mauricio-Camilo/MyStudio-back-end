import express, {json} from "express";
import "express-async-errors"; 
import cors from "cors";

const app = express();
app.use(json());
app.use(cors());

export default app;
