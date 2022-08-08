import { Request, Response } from "express";

import * as instructorsService from "../services/instructorsService.js"

export async function createInstructor (req: Request, res: Response) {

    const {name, cpf, password, confirmPassword} = req.body;

    await instructorsService.registerInstructor({name, cpf, password}, confirmPassword);

    res.status(201).send("Rota de signup ativa");
}

export async function loginInstructor (req: Request, res: Response) {

    const {cpf, password} = req.body;

    const token = await instructorsService.signIn({cpf, password});

    res.status(200).send(token);
}