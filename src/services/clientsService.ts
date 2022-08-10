import * as clientsRepository from "./../repositories/clientsRepository.js";
import * as paymentsRepository from "./../repositories/paymentsRepository.js";

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

    const formattedStartDate = getAmericanFormatDate(startDate);

    if (formattedStartDate.toJSON() === null) {
        throw { name: "validationError", message: "Invalid date"}
    }

    const expirationDate = calculateExpirationDate(payment, formattedStartDate);

    const paymentId = await clientsRepository.findPaymentId(payment);

    delete client.payment;

    await clientsRepository.registerClient({...client,
        instructorId, paymentId, finishDate: expirationDate, notification: false})
}

export function getAmericanFormatDate (startDate : string) {

    const splitDate = startDate.split("/");

    const arrayDate = [];

    arrayDate.push(splitDate[1], splitDate[0], splitDate[2]);

    const americanDate = arrayDate.join("-");

    return new Date(americanDate);
}

export function calculateExpirationDate (payment : string, americanFormattedDate : any) {
  
    if (payment === "Mensal") {
        const formattedExpirtationDate = new Date(americanFormattedDate.setDate(americanFormattedDate.getDate() + 30));
        return formattedExpirtationDate.toLocaleDateString("pt-BR");
    }
    if (payment === "Trimestral") {
        const formattedExpirtationDate = new Date(americanFormattedDate.setDate(americanFormattedDate.getDate() + 90));
        return formattedExpirtationDate.toLocaleDateString("pt-BR");
    }
    if (payment === "Semestral") {
        const formattedExpirtationDate = new Date(americanFormattedDate.setDate(americanFormattedDate.getDate() + 180));
        return formattedExpirtationDate.toLocaleDateString("pt-BR");
    }
    if (payment === "Anual") {
        const formattedExpirtationDate = new Date(americanFormattedDate.setDate(americanFormattedDate.getDate() + 365));
        return formattedExpirtationDate.toLocaleDateString("pt-BR");
    }
}

export function calculateDaysLeft(expirationDate : any) {

    const today = new Date();

    let differenceInMiliSeconds = expirationDate.getTime() - today.getTime();
    
    let differenceInDays = differenceInMiliSeconds / (1000 * 3600 * 24)
    
    return differenceInDays;
}

export async function getAllClients (instructorId : number) {

    const clients = await clientsRepository.getAllClients(instructorId);

    clients.forEach (async (client) =>  {
        const formattedDate = getAmericanFormatDate(client.finishDate)
        const daysLeft = calculateDaysLeft(formattedDate);
        client.daysLeft = daysLeft;
        if (daysLeft < 7) {
            client.notification = true;
        }
    })

    return clients;
}

export async function deleteClient (clientId: number) {

    const checkClientId = await clientsRepository.findClientById(clientId);

    if (!checkClientId) {
        throw { name: "notFound", message: "Client not found"}
    }
    await clientsRepository.deleteClientById(clientId);
}

export async function updateClient (client : any, clientId : number) {

    
    const response = await clientsRepository.findClientById(clientId);
    
    if (!response) {
        throw { name: "notFound", message: "Client not found"}
    }
    
    const updatedClient = await updateClientProperties(client, response);
    
    await clientsRepository.updateClientData(updatedClient, clientId);
}

export async function updateClientProperties (client : any, response : any) {
    
    let newExpirationDate = response.finishDate;
    
    if (client.name === "") client.name = response.name;
    
    if (client.startDate === "") client.startDate = response.startDate;
    
    if (client.payment === "")
    client.payment = await paymentsRepository.findPaymentMethod(response.paymentId);

    if (client.payment !== "" || client.startDate !== "") {
        const formattedStartDate = getAmericanFormatDate(client.startDate)
        newExpirationDate = calculateExpirationDate(client.payment, formattedStartDate);
    }
    
    client.payment = await clientsRepository.findPaymentId(client.payment)

    return {...client, finishDate: newExpirationDate};
}