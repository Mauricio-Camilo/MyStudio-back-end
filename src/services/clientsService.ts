import { clientsRepository } from "./../repositories/clientsRepository.js";
import { paymentsRepository } from "./../repositories/paymentsRepository.js";

export interface CreateClientData {
    name: string,
    payment: string,
    service: string,
    startDate: string
}

async function createClient (client : CreateClientData, instructorId : number) {

    const {name, service, payment, startDate} = client;

    let notification : boolean = false;

    const checkName = await clientsRepository.findClientName(name);

    if (checkName) {
        throw { name: "alreadyExists", message: "Name already exists"}
    }

    const formattedStartDate = clientsService.getAmericanFormatDate(startDate);

    if (formattedStartDate.toJSON() === null) {
        throw { name: "validationError", message: "Invalid date"}
    }

    const expirationDate = clientsService.calculateExpirationDate(payment, formattedStartDate);

    const daysLeft = Math.round(clientsService.calculateDaysLeft(expirationDate));

    if (daysLeft < 7) notification = true;

    const paymentId = await clientsRepository.findPaymentId(payment);

    const serviceId = await clientsRepository.findServiceId(service);

    delete client.payment;

    delete client.service;

    await clientsRepository.registerClient({...client,
        instructorId, paymentId, serviceId, finishDate: expirationDate, daysLeft, notification});
}

function getAmericanFormatDate (startDate : string) {

    const splitDate = startDate.split("/");

    const arrayDate = [];

    arrayDate.push(splitDate[1], splitDate[0], splitDate[2]);

    const americanDate = arrayDate.join("-");

    return new Date(americanDate);
}

function calculateExpirationDate (payment : string, americanFormattedDate : any) {

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

function calculateDaysLeft(expirationDate : any) {

    const formattedExpirtationDate = clientsService.getAmericanFormatDate(expirationDate);

    const today = new Date();

    let daysLeftInMiliseconds = formattedExpirtationDate.getTime() - today.getTime();

    let daysLeft = daysLeftInMiliseconds / (1000 * 3600 * 24);

    return daysLeft;
}

async function getAllClients (instructorId : number) {

    const clients = await clientsRepository.getAllClients(instructorId);

    const notificationDate = 14;

    clients.forEach (async (client) =>  {
        const daysLeft = calculateDaysLeft(client.finishDate);
        client.daysLeft = Math.round(daysLeft);
        if (daysLeft < notificationDate) { client.notification = true }
        else { client.notification = false }
    })

    return clients;
}

async function deleteClient (clientId: number) {

    const checkClientId = await clientsRepository.findClientById(clientId);

    if (!checkClientId) {
        throw { name: "notFound", message: "Client not found"}
    }
    await clientsRepository.deleteClientById(clientId);
}

async function updateClient (client : CreateClientData, clientId : number) {

    const response = await clientsRepository.findClientById(clientId);

    if (!response) {
        throw { name: "notFound", message: "Client not found"}
    }

    const updatedClient = await clientsService.updateClientProperties(client, response);

    await clientsRepository.updateClientData(updatedClient, clientId);
}

async function updateClientProperties (client : any, response : any) {

    let newExpirationDate = response.finishDate;

    if (client.name === "") client.name = response.name;

    if (client.startDate === "") client.startDate = response.startDate;

    if (client.payment === "")
    client.payment = await paymentsRepository.findPaymentMethod(response.paymentId);

    if (client.service === "") {client.service = response.serviceId}
    
    else client.service = await clientsRepository.findServiceId(client.service);
    
    const formattedStartDate = clientsService.getAmericanFormatDate(client.startDate);
    newExpirationDate = clientsService.calculateExpirationDate(client.payment, formattedStartDate);
    const newDaysLeft = Math.round(clientsService.calculateDaysLeft(newExpirationDate));

    if (newDaysLeft < 7) client.notification = true;
    else client.notification = false;

    client.payment = await clientsRepository.findPaymentId(client.payment)

    return {...client, finishDate: newExpirationDate, daysLeft: newDaysLeft};
}

export const clientsService = {
    createClient,
    getAmericanFormatDate,
    calculateExpirationDate,
    calculateDaysLeft,
    getAllClients,
    deleteClient,
    updateClient,
    updateClientProperties
}