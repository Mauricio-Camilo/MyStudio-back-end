import * as clientsfactory from "./clientsFactory.js";

export async function createScenarioOneSeveralClientsCreated(clientsQuantity : number) {
    const clients = [];
    for (let i = 0; i < clientsQuantity; i ++) {
        const newClient = clientsfactory.createClient();
        const client = await clientsfactory.postClient(newClient, i); 
        clients.push(client);
    }
    return clients;
}


