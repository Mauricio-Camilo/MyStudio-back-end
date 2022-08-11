import prisma from "./../../config/database.js";
import supertest from "supertest";
import app from "./../../app.js";
import dotenv from "dotenv";

import * as instructorsfactory from "./../factories/instructorFactory.js"
import * as clientsfactory from "./../factories/clientsFactory.js"


dotenv.config();

beforeEach(async () => {
    await clientsfactory.deleteAll();
})

// describe ("Authentication test suit", () => {
//     it ("given name, cpf and password, create instructor", async () => {
//         const instructor = instructorsfactory.createInstructor();
//         const response = await supertest(app).post("/signup").send(instructor);
//         expect (response.statusCode).toBe(201);

//         const findInstructor = await prisma.instructor.findFirst({where: {name: instructor.name}});
//         expect (instructor.name).toBe(findInstructor.name);
//     });

//     it("given already used cpf, fail to create recommendation", async () => {
//         const instructor = instructorsfactory.createInstructor();
//         await instructorsfactory.postInstructor(instructor);

//         const response = await supertest(app).post("/signup").send(instructor);
//         expect(response.statusCode).toBe(409);
//     });

//     it("given invalid inputs or incorret password, fail to create instructor", async () => {
//         const instructor = instructorsfactory.createInstructor();
//         instructor.cpf = "000.000.000.00"

//         const response = await supertest(app).post("/signup").send(instructor);
//         expect(response.statusCode).toBe(422);
//     });

//     it ("given valid cpf and password, login instructor", async () => {
//         const instructor = instructorsfactory.createInstructor();
//         await instructorsfactory.postInstructor(instructor);

//         const login = instructorsfactory.createLogin(instructor);
//         const response = await supertest(app).post("/signin").send(login);
//         expect (response.statusCode).toBe(200);

//         const token = response.text;
//         expect(token).not.toBeUndefined();
//     });

//     it ("given inexistent cpf, fail to login instructor", async () => {
//         const instructor = instructorsfactory.createInstructor();
//         await instructorsfactory.postInstructor(instructor);

//         const login = instructorsfactory.createLogin(instructor);
//         login.cpf = "111.111.111-00"
//         const response = await supertest(app).post("/signin").send(login);
//         expect (response.statusCode).toBe(404);
//     });

//     it ("given incorret password, fail to login instructor", async () => {
//         const instructor = instructorsfactory.createInstructor();
//         await instructorsfactory.postInstructor(instructor);

//         const login = instructorsfactory.createLogin(instructor);
//         login.password = "anypassowrd"
//         const response = await supertest(app).post("/signin").send(login);
//         expect (response.statusCode).toBe(401);
//     });

//     it ("given invalid cpf, fail to login instructor", async () => {
//         const instructor = instructorsfactory.createInstructor();
//         await instructorsfactory.postInstructor(instructor);

//         const login = instructorsfactory.createLogin(instructor);
//         login.cpf = "111.111.111.00"
//         const response = await supertest(app).post("/signin").send(login);
//         expect (response.statusCode).toBe(422);
//     });
// })

async function generateToken () {
    await clientsfactory.createPaymentTableData();
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
        await clientsfactory.postClient(client);
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