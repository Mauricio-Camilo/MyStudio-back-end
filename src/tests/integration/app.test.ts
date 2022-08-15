import prisma from "./../../config/database.js";
import supertest from "supertest";
import app from "./../../app.js";
import dotenv from "dotenv";

import * as instructorsfactory from "./../factories/instructorFactory.js";
import * as clientsfactory from "./../factories/clientsFactory.js";
import * as scenariofactory from "./../factories/scenarioFactory.js";

dotenv.config();

beforeEach(async () => {
    await clientsfactory.deleteAll();
})

describe ("Authentication test suit", () => {
    it ("given name, cpf and password, create instructor", async () => {
        const instructor = instructorsfactory.createInstructor();
        const response = await supertest(app).post("/signup").send(instructor);
        expect (response.statusCode).toBe(201);

        const findInstructor = await prisma.instructor.findFirst({where: {name: instructor.name}});
        expect (instructor.name).toBe(findInstructor.name);
    });

    it("given already used cpf, fail to create recommendation", async () => {
        const instructor = instructorsfactory.createInstructor();
        await instructorsfactory.postInstructor(instructor);

        const response = await supertest(app).post("/signup").send(instructor);
        expect(response.statusCode).toBe(409);
    });

    it("given invalid inputs or incorret password, fail to create instructor", async () => {
        const instructor = instructorsfactory.createInstructor();
        instructor.cpf = "000.000.000.00"

        const response = await supertest(app).post("/signup").send(instructor);
        expect(response.statusCode).toBe(422);
    });

    it ("given valid cpf and password, login instructor", async () => {
        const instructor = instructorsfactory.createInstructor();
        await instructorsfactory.postInstructor(instructor);

        const login = instructorsfactory.createLogin(instructor);
        const response = await supertest(app).post("/signin").send(login);
        expect (response.statusCode).toBe(200);

        const token = response.text;
        expect(token).not.toBeUndefined();
    });

    it ("given inexistent cpf, fail to login instructor", async () => {
        const instructor = instructorsfactory.createInstructor();
        await instructorsfactory.postInstructor(instructor);

        const login = instructorsfactory.createLogin(instructor);
        login.cpf = "111.111.111-00"
        const response = await supertest(app).post("/signin").send(login);
        expect (response.statusCode).toBe(404);
    });

    it ("given incorret password, fail to login instructor", async () => {
        const instructor = instructorsfactory.createInstructor();
        await instructorsfactory.postInstructor(instructor);

        const login = instructorsfactory.createLogin(instructor);
        login.password = "anypassowrd"
        const response = await supertest(app).post("/signin").send(login);
        expect (response.statusCode).toBe(401);
    });

    it ("given invalid cpf, fail to login instructor", async () => {
        const instructor = instructorsfactory.createInstructor();
        await instructorsfactory.postInstructor(instructor);

        const login = instructorsfactory.createLogin(instructor);
        login.cpf = "111.111.111.00"
        const response = await supertest(app).post("/signin").send(login);
        expect (response.statusCode).toBe(422);
    });
})

async function generateToken () {
    await clientsfactory.createPaymentTableData();
    await clientsfactory.createServicesData();
    const instructor = instructorsfactory.createInstructor();
    const instrucutorId = await instructorsfactory.postInstructor(instructor);

    const login = instructorsfactory.createLogin(instructor);
    const response = await supertest(app).post("/signin").send(login);
    const token = response.text;
    return {token, instrucutorId};
}

describe ("Create clients test suit", () => {

    it("Should create a client", async () => {
        const login = await generateToken();
        const client = clientsfactory.createClient();
        const response = await supertest(app).post("/clients").send(client).set("Authorization", `Bearer ${login.token}`);
        expect(response.statusCode).toBe(201);

        const checkClient = await prisma.client.findFirst({where: {name: client.name}});
        expect(checkClient.name).toBe(client.name);
    })

    it("Should fail to create a client, repeated name", async () => {
        const login = await generateToken();
        const client = clientsfactory.createClient();
        await clientsfactory.postClient(client, 1);
        const response = await supertest(app).post("/clients").send(client).set("Authorization", `Bearer ${login.token}`);
        expect(response.statusCode).toBe(409);
    })

    it("Should fail to create a client, invalid inputs", async () => {
        const login = await generateToken();
        const client = clientsfactory.createClient();
        client.payment = "Bimestral";
        const response = await supertest(app).post("/clients").send(client).set("Authorization", `Bearer ${login.token}`);
        expect(response.statusCode).toBe(422);
    })

    it("Should fail to create a client, invalid token", async () => {
        const login = await generateToken();
        const client = clientsfactory.createClient();
        login.token = "invalid token"
        const response = await supertest(app).post("/clients").send(client).set("Authorization", `Bearer ${login.token}`);
        expect(response.statusCode).toBe(401);
    })

    it("Should fail to create a client, invalid date", async () => {
        const login = await generateToken();
        const client = clientsfactory.createClient();
        client.startDate = "35/20/2022"
        const response = await supertest(app).post("/clients").send(client).set("Authorization", `Bearer ${login.token}`);
        expect(response.statusCode).toBe(422);
    })
})

describe("Get clients test suit", () => {
    it("should get all clients" , async () => {
        const login = await generateToken();
        const clientsQuantity = 5;
        const scenario = await scenariofactory.createScenarioOneSeveralClientsCreated(clientsQuantity);
        const response = await supertest(app).get("/clients").set("Authorization", `Bearer ${login.token}`);
        expect(response.body.length).toBe(clientsQuantity);
        expect(scenario[0].name).toEqual(response.body[0].name);
    })

    it("should get all clients, invalid token" , async () => {
        const login = await generateToken();
        login.token = "invalid token";
        const response = await supertest(app).get("/clients").set("Authorization", `Bearer ${login.token}`);
        expect(response.statusCode).toBe(401);
    })
})

describe("Delete clients test suit", () => {
    it("should delete a client", async ()=> {
        const login = await generateToken();
        const clientId = 1;
        const client = clientsfactory.createClient();
        await clientsfactory.postClient(client,clientId);
        const response = await supertest(app).delete(`/clients/${clientId}`);
        expect (response.statusCode).toBe(200);
        expect (response.body[0]).toBeUndefined();
    })

    it("should fail to delete a client, invalid clientId", async ()=> {
        const login = await generateToken();
        const clientId = 1;
        const client = clientsfactory.createClient();
        await clientsfactory.postClient(client,clientId);
        const response = await supertest(app).delete(`/clients/2`);
        expect (response.statusCode).toBe(404);
    })
})

describe("Update clients test suit", () => {
    it("should update a client", async ()=> {
        const login = await generateToken();
        const clientId = 1;
        const client = clientsfactory.createClient();
        await clientsfactory.postClient(client,clientId);
        const updatedClient = clientsfactory.updateClient();
        const response = await supertest(app).put(`/clients/${clientId}`).send(updatedClient);
        
        const responseClient = await prisma.client.findFirst({where: {id: clientId}});
        expect (response.statusCode).toBe(200);
        expect (responseClient.name).toBe(updatedClient.name);
    })

    it("should fail to update a client, invalid clientId", async ()=> {
        const login = await generateToken();
        const clientId = 5;
        const client = clientsfactory.createClient();
        await clientsfactory.postClient(client,clientId);
        const response = await supertest(app).put(`/clients/10`).send(client);
        expect (response.statusCode).toBe(404);
    })
})
