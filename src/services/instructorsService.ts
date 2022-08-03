import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Instructor } from '@prisma/client';

import * as instructorsRepository from "./../repositories/instructorsRepository.js";

dotenv.config();

export type CreateInstructorData = Omit<Instructor, "id">

export async function registerInstructor (instructor : CreateInstructorData, confirmPassword : string) {

    const {name, cpf, password} = instructor;

    const checkCpf = await instructorsRepository.findCpf(cpf);

    if (checkCpf) {
        throw { name: "alreadyExists", message: "Cpf already exists"}
    }

    const cryptedPassword = cryptPassword(password);

    await instructorsRepository.registerInstructor({...instructor, password: cryptedPassword})
}



export function cryptPassword (password : string) {
    const SALT = 10;
    const cryptedPassword = bcrypt.hashSync(password, SALT);
    return cryptedPassword;
}

// export async function checkSignUpData (cpf : string, password : string, confirmPassword : string) {

//     const checkCpf = await instructorsRepository.findCpf(cpf);

//     if (checkCpf) {
//         throw { name: "alreadyExists", message: "Cpf already exists"}
//     }
    
//     if (password !== confirmPassword) {
//         throw { name: "notAuthorized", message: "Invalid confirm password"}
//     }

// }

