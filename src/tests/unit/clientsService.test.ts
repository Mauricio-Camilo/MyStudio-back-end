import { jest } from "@jest/globals";
import { clientsService } from "./../../services/clientsService.js";
import { clientsRepository } from "./../../repositories/clientsRepository.js";
import { paymentsRepository } from "./../../repositories/paymentsRepository.js";
import { CreateClientData } from "./../../services/clientsService.js";

describe("clients service create client function tests suite", () => {

    const payments = ["Mensal", "Trimestral", "Semestral", "Anual"];

    payments.forEach(payment => {
        it (`should create a client, with ${payment} payment`, async () => {

            const client : CreateClientData = {
                name: "Aluno1",
                payment: payment,
                service: "Pilates",
                startDate: "01/01/2022",
            }
    
            jest.spyOn(clientsRepository, 'findClientName').mockImplementationOnce(() : any => {});
    
            jest.spyOn(clientsRepository, 'findPaymentId').mockImplementationOnce(() : any => {});
    
            jest.spyOn(clientsRepository, 'findServiceId').mockImplementationOnce(() : any => {});

            jest.spyOn(clientsRepository, 'registerClient').mockImplementationOnce(() : any => {});
    
            await clientsService.createClient(client,1)
    
            expect(clientsRepository.findClientName).toBeCalled();
            expect(clientsRepository.findPaymentId).toBeCalled();
            expect(clientsRepository.findPaymentId).toBeCalled();
            expect(clientsRepository.registerClient).toBeCalled();
        })
    })

    it ("should fail to create a client, name already exists", async () => {

        const client : CreateClientData = {
            name: "Aluno1",
            payment: "Mensal",
            service: "Pilates",
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
            service: "Pilates",
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

describe("clients service get all clients function tests suite", () => {

    it("Should get all clients", async () => {
        const client : any = [{
            id: 1,
            name: "Aluno1",
            instructorId: 3,
            serviceId: 1,
            paymentId: 2,
            startDate: "01/01/2022",
            finishDate: "15/08/2022",
            daysLeft: -1,
            notification: false
        },
        {
            id: 2,
            name: "Aluno2",
            instructorId: 3,
            serviceId: 1,
            paymentId: 3,
            startDate: "01/01/2022",
            finishDate: "15/12/2022",
            daysLeft: -1,
            notification: false
        }]
        jest.spyOn(clientsRepository, 'getAllClients').mockImplementationOnce(() : any => {
            return client
        });

        await clientsService.getAllClients(client.instructorId);

        expect(clientsRepository.getAllClients).toBeCalled();
    });
})

describe("clients service delete client tests suite", () => {

    it("should delete a client", async () => {

        const clientId = 1;

        jest.spyOn(clientsRepository, 'findClientById').mockImplementationOnce(() : any => {
            return clientId
        });

        jest.spyOn(clientsRepository, 'deleteClientById').mockImplementationOnce(() : any => {});

        await clientsService.deleteClient(clientId);

        expect(clientsRepository.findClientById).toBeCalled();
        expect(clientsRepository.deleteClientById).toBeCalled();
    })

    it("should fail to delete a client, invalid id", async () => {

        const clientId = 1;

        jest.spyOn(clientsRepository, 'findClientById').mockImplementationOnce(() : any => {});

        const promise =  clientsService.deleteClient(clientId);

        expect(promise).rejects.toEqual({
            message: "Client not found",
            name: "notFound"
        })
    })
})

describe("clients service update client tests suite", () => {

    it("should update a client", async () => {
        const client : CreateClientData = {
            name: "",
            payment: "",
            service: "",
            startDate: "",
        }

        const clientId = 1;

        jest.spyOn(clientsRepository, 'findClientById').mockImplementationOnce(() : any => {
            return clientId
        });

        jest.spyOn(clientsService, 'updateClientProperties').mockImplementationOnce(() : any => {
            return {...client, finishDate: "01/01/2030"}
        });

        jest.spyOn(clientsRepository, 'updateClientData').mockImplementationOnce(() : any => {});

        await clientsService.updateClient(client,clientId);

        expect(clientsRepository.findClientById).toBeCalled();
        expect(clientsService.updateClientProperties).toBeCalled();
        expect(clientsRepository.updateClientData).toBeCalled();
    })

    const daysLeftToPassesUnitTests = [5,-10];

    const services = ["", "Pilates"];

    daysLeftToPassesUnitTests.forEach( async (day) => {
        services.forEach( async (service) => {
            function calculateDaysleft () {
                const today = new Date();
                const daysLeft = new Date(today.setDate(today.getDate() - day));
                return daysLeft.toLocaleDateString("pt-BR");
            }
            it("should get the updated client data, with payment and startDate empties", async () => {
                const client : CreateClientData = {
                    name: "",
                    payment: "",
                    service: service,
                    startDate: "",
                }
        
                jest.spyOn(paymentsRepository, 'findPaymentMethod').mockImplementationOnce(() : any => {
                    return "Mensal"
                });
        
                jest.spyOn(clientsRepository, 'findPaymentId').mockImplementationOnce(() : any => {
                    return 1;
                });
        
                jest.spyOn(clientsService, 'getAmericanFormatDate').mockImplementationOnce(() : any => {});
        
                jest.spyOn(clientsService, 'calculateExpirationDate').mockImplementationOnce(() : any => {
                    return calculateDaysleft()
                });
        
                await clientsService.updateClientProperties(client,client);
        
                expect(paymentsRepository.findPaymentMethod).toBeCalled();
                expect(clientsRepository.findPaymentId).toBeCalled();
                expect(clientsService.getAmericanFormatDate).toBeCalled();
                expect(clientsService.calculateExpirationDate).toBeCalled();
            })
        })
    })

    it("should fail to update a client, invalid id", async () => {
        const client : CreateClientData = {
            name: "",
            payment: "",
            service: "",
            startDate: "",
        }

        const clientId = 10;

        jest.spyOn(clientsRepository, 'findClientById').mockImplementationOnce(() : any => {});

        const promise =  clientsService.updateClient(client,clientId);

        expect(promise).rejects.toEqual({
            message: "Client not found",
            name: "notFound"
        })
    })
})