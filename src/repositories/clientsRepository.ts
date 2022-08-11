import { Client } from "@prisma/client";
import prisma from "./../config/database.js";

export type SaveClientData = Omit<Client,"id"|"daysLeft">

async function findClientName (name: string) {
    const instructor = await prisma.client.findFirst({where: {name}});
    return instructor;
}

async function findPaymentId (period: string) {
  const paymentId = await prisma.payment.findFirst({where: {period}});
  return paymentId.id;
}

async function registerClient (client : SaveClientData) {
  await prisma.client.create({data : client})
}

async function updateNotificationStatus (id : number, status : boolean) {
  await prisma.client.update({
    where: {id},
    data: {
      notification: status
    }
  })
}

async function getAllClients (instructorId : number) {
  const clients = await prisma.client.findMany({
    where: {instructorId},
    select: {
      id: true, name: true, startDate: true, finishDate: true, notification: true, daysLeft: true,
    payments: {select: 
      {period: true}}
    }
  })
  return clients;
}

async function findClientById (id: number) {
  const client = await prisma.client.findFirst({where: {id}});
  return client;
}

async function deleteClientById (id: number) {
  await prisma.client.delete({where :{id}})
}

async function updateClientData (client : any, id : number) {
  await prisma.client.update({
    where: {id},
    data: {
      name: client.name,
      paymentId: client.payment,
      startDate: client.startDate,
      finishDate: client.finishDate
    }
  })
}

export const clientsRepository = {
  deleteClientById,
  findClientById,
  findClientName,
  findPaymentId,
  getAllClients,
  registerClient,
  updateClientData,
  updateNotificationStatus
}



