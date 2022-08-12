import { Request, Response } from "express";
import * as testsService from "../services/testsService.js"

export async function resetDatabase (req: Request, res: Response) {
  await testsService.resetDatabase();
  res.sendStatus(200);
}

export async function seedDatabase (req: Request, res: Response) {
  await testsService.seedDatabase();
  res.sendStatus(201);
}

