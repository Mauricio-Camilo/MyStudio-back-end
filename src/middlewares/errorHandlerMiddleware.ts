import { Request, Response, NextFunction } from "express";

export default function errorHandlerMiddleware
(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error.name === "notFound") {
        console.log(error.message);
        res.status(404).send(error.message);
    }

    if (error.name === "notAuthorized") {
        console.log(error.message);
        res.status(401).send(error.message);
    }

    if (error.name === "validationError") {
        console.log(error.message);
        res.status(422).send(error.message);
    }

    if (error.name === "alreadyExists") {
        console.log(error.message);
        res.status(409).send(error.message);
    }

    if (error.name === "ConnectionError") {
        console.log(error.message);
        res.status(500).send(error.message);
    }
  }



