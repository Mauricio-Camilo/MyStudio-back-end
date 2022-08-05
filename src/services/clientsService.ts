import dayjs from "dayjs";
import * as clientsRepository from "./../repositories/clientsRepository.js"

export interface CreateClientData {
    name: string,
    payment: string,
    startDate: string
}

export async function createClient (client : CreateClientData, instructorId : number) {

    const {name, payment, startDate} = client;

    const checkName = await clientsRepository.findClientName(name);

    if (checkName) {
        throw { name: "alreadyExists", message: "Name already exists"}
    }

    const expirationDate = calculateExpirationDate(payment, startDate);

    const paymentId = await clientsRepository.findPaymentId(payment);

    delete client.payment;

    await clientsRepository.registerClient({...client,
        instructorId, paymentId, finishDate: expirationDate, notification: false})
}

export function calculateExpirationDate (payment : string, startDate : string) {

    const stringStartDate = startDate.replace(/\//g,"-");

    let formattedStartDate = new Date(stringStartDate);

    if (payment === "mensal") {
        const formattedExpirtationDate = new Date(formattedStartDate.setDate(formattedStartDate.getDate() + 30));
        return formattedExpirtationDate.toLocaleDateString();
    }
    if (payment === "trimestral") {
        const formattedExpirtationDate = new Date(formattedStartDate.setDate(formattedStartDate.getDate() + 90));
        return formattedExpirtationDate.toLocaleDateString();
    }
    if (payment === "semestral") {
        const formattedExpirtationDate = new Date(formattedStartDate.setDate(formattedStartDate.getDate() + 180));
        return formattedExpirtationDate.toLocaleDateString();
    }
    if (payment === "anual") {
        const formattedExpirtationDate = new Date(formattedStartDate.setDate(formattedStartDate.getDate() + 365));
        return formattedExpirtationDate.toLocaleDateString();
    }
}