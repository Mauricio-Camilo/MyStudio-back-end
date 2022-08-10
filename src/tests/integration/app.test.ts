import prisma from "./../../config/database.js";
import supertest from "supertest";
import app from "./../../app.js";
import dotenv from "dotenv";

dotenv.config();

describe ("Authentication test suit", () => {
    it ("given name, cpf and password, create instructor", async () => {
        const instructor = {
            name: "Instrutor1",
            cpf: "000.000.000.10",
            password: "abcdefg",
            confirmPassword: "abcdefg"
        }
        const response = await supertest(app).post("/signup").send(instructor);
        expect (response.statusCode).toBe(201);
    })
})