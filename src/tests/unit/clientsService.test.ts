import { jest } from "@jest/globals";
import { clientsService } from "./../../services/clientsService.js";
import { clientsRepository } from "./../../repositories/clientsRepository.js";
import { CreateClientData } from "./../../services/clientsService.js";
import { tokenProvider } from "../../providers/tokenProvider.js";

describe("instructors service create client function tests suite", () => {

    const payments = ["Mensal", "Trimestral", "Semestral", "Anual"];

    payments.forEach(payment => {
        it (`should create a client, with ${payment} payment`, async () => {

            const client : CreateClientData = {
                name: "Aluno1",
                payment: payment,
                startDate: "01/01/2022",
            }
    
            jest.spyOn(clientsRepository, 'findClientName').mockImplementationOnce(() : any => {});
    
            jest.spyOn(clientsRepository, 'findPaymentId').mockImplementationOnce(() : any => {});
    
            jest.spyOn(clientsRepository, 'registerClient').mockImplementationOnce(() : any => {});
    
            await clientsService.createClient(client,1)
    
            expect(clientsRepository.findClientName).toBeCalled();
            expect(clientsRepository.findPaymentId).toBeCalled();
            expect(clientsRepository.registerClient).toBeCalled();
        })
    })

    it ("should fail to create a client, name already exists", async () => {

        const client : CreateClientData = {
            name: "Aluno1",
            payment: "Mensal",
            startDate: "01/01/2022",
        }

        jest.spyOn(clientsRepository, 'findClientName').mockImplementationOnce(() : any => {
            return client.name;
        });

        const promise =  clientsService.createClient(client,1)

        expect(promise).rejects.toEqual({
            message: "Name already exists",
            name: "alreadyExists"
        })

    })

    it ("should fail to create a client, invalid startDate", async () => {

        const client : CreateClientData = {
            name: "Aluno1",
            payment: "Mensal",
            startDate: "01/15/2022",
        }

        jest.spyOn(clientsRepository, 'findClientName').mockImplementationOnce(() : any => {});

        const promise =  clientsService.createClient(client,1)

        expect(promise).rejects.toEqual({
            message: "Invalid date",
            name: "validationError"
        })

    })
})
