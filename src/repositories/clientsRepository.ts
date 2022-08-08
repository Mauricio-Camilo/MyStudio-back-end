import { Client } from "@prisma/client";
import prisma from "./../config/database.js";

export type SaveClientData = Omit<Client,"id">

export async function findClientName (name: string) {
    const instructor = await prisma.client.findFirst({where: {name}});
    return instructor;
}

export async function findPaymentId (period: string) {
  const paymentId = await prisma.payment.findFirst({where: {period}});
  return paymentId.id;
}

export async function registerClient (client : SaveClientData) {
  await prisma.client.create({data : client})
}

export async function getAllClients (instructorId : number) {
  const clients = await prisma.client.findMany({where: {instructorId}})
  return clients;
}

export async function findClientById (id: number) {
  const client = await prisma.client.findFirst({where: {id}});
  return client;
}

export async function deleteClientById (id: number) {
  await prisma.client.delete({where :{id}})
}

