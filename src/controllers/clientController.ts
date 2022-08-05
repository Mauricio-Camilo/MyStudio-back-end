import { Request, Response } from "express";
import * as clientsServices from "./../services/clientsService.js"

export async function createClient (req: Request, res: Response) {

    const {user} = res.locals;

    const instructorId = user.id;

    await clientsServices.createClient(req.body, instructorId);

    res.status(201).send("Ok");
}

export async function getAllClients (req: Request, res: Response) {

    const {user} = res.locals;

    const instructorId = user.id;

    const clients = await clientsServices.getAllClients(instructorId);

    res.status(200).send(clients);

}