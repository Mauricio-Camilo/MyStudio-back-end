import dayjs from "dayjs";
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

    console.log("entrou aqui")

    const expirationDate = calculateExpirationDate(payment, startDate);

    console.log(expirationDate);

    // const paymentId = await clientsRepository.findPaymentId(payment);

    // delete client.payment;

    // await clientsRepository.registerClient({...client,
    //     instructorId, paymentId, finishDate: expirationDate, notification: false})

    // console.log("Passou 3x no repository")

}

export function calculateExpirationDate (payment : string, startDate : string) {

    const stringStartDate = startDate.replace(/\//g,"-");

    let formattedStartDate = new Date(stringStartDate);

    if (payment === "Mensal") {
        const formattedExpirtationDate = new Date(formattedStartDate.setDate(formattedStartDate.getDate() + 30));
        return formattedExpirtationDate.toLocaleDateString();
    }
    if (payment === "Trimestral") {
        const formattedExpirtationDate = new Date(formattedStartDate.setDate(formattedStartDate.getDate() + 90));
        return formattedExpirtationDate.toLocaleDateString();
    }
    if (payment === "Semestral") {
        const formattedExpirtationDate = new Date(formattedStartDate.setDate(formattedStartDate.getDate() + 180));
        return formattedExpirtationDate.toLocaleDateString();
    }
    if (payment === "Anual") {
        const formattedExpirtationDate = new Date(formattedStartDate.setDate(formattedStartDate.getDate() + 365));
        return formattedExpirtationDate.toLocaleDateString();
    }
}

export async function getAllClients (instructorId : number) {

    const clients = await clientsRepository.getAllClients(instructorId);

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

    const checkClientId = await clientsRepository.findClientById(clientId);

    if (!checkClientId) {
        throw { name: "notFound", message: "Client not found"}
    }

    let calculateNewExpirationDate = false;

    /* README: CRIAR UMA LÓGICA PARA CHAMAR A FUNÇÃO DE CALCULAR O EXPIRATION DATE
    CASO UMA NOVA DATA OU UM NOVO PLANO FOR CHAMADO*/

    const response = await clientsRepository.findClientById(clientId);

    if (client.name === "")  client.name = response.name;

    if (client.payment !== "" || client.startDate !== ""){
        calculateNewExpirationDate = true;
    } 
    
    if (client.payment === "") {
        const result = await paymentsRepository.findPaymentMethod(response.paymentId);
        client.payment = result.period;
    }

    if (client.startDate === "") {
        client.startDate = response.startDate;
    } 

    if (calculateNewExpirationDate) {
        const newExpirationDate = calculateExpirationDate(client.payment, client.startDate);
    }
    // console.log(client, newExpirationDate);


    
}