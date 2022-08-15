import { Request, Response } from "express";
import { clientsService } from "./../services/clientsService.js"

export async function createClient (req: Request, res: Response) {

    const {user} = res.locals;

    const instructorId = user.id;

    await clientsService.createClient(req.body, instructorId);

    res.status(201).send("Client Created");
}

export async function getAllClients (req: Request, res: Response) {

    const {user} = res.locals;

    const instructorId = user.id;

    const clients = await clientsService.getAllClients(instructorId);

    res.status(200).send(clients);
}

export async function deleteClient (req: Request, res: Response) {

    const {id} = req.params;

    await clientsService.deleteClient(parseInt(id))

    res.status(200).send("Client deleted")
}

export async function updateClient (req: Request, res: Response) {

    const {id} = req.params;
    
    await clientsService.updateClient(req.body, parseInt(id));

    res.status(200).send("Client updated");
}