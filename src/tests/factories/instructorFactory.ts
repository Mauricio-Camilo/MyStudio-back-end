import prisma  from "./../../config/database.js";
import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";

export interface CreateInstructorData {
    name: string;
    cpf: string;
    password: string;
    confirmPassword: string
}

export function createInstructor () {
    const password = faker.internet.password(7);
    const instructor : CreateInstructorData = {
        name: faker.name.firstName(),
        cpf: "000.000.000-00",
        password,
        confirmPassword: password
    }
    return instructor;
}

export function createLogin (instructor : CreateInstructorData) {
    const login : any = {
        cpf: instructor.cpf,
        password: instructor.password
    }
    return login
}

export async function postInstructor (data : CreateInstructorData) {
    const {name, cpf, password} = data;
    const instructor = await prisma.instructor.create({
        data: {
            name,
            cpf,
            password: bcrypt.hashSync(password,10)
        }
    })
    return instructor.id;
}