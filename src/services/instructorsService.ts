import bcrypt from 'bcrypt';
import { Instructor } from '@prisma/client';
import * as tokenProvider from "./../providers/tokenProvider.js"
import * as instructorsRepository from "./../repositories/instructorsRepository.js";

export type CreateInstructorData = Omit<Instructor, "id">
export type CreateLoginData = Omit<Instructor, "id"|"name">

export async function registerInstructor (instructor : CreateInstructorData, confirmPassword : string) {

    const {cpf, password} = instructor;

    const checkCpf = await instructorsRepository.findCpf(cpf);
        
    if (checkCpf) {
        throw { name: "alreadyExists", message: "Cpf already exists"}
    }

    const cryptedPassword = cryptPassword(password);
    
    await instructorsRepository.registerInstructor({...instructor, password: cryptedPassword});
}

export function cryptPassword (password : string) {
    const SALT = 10;
    const cryptedPassword = bcrypt.hashSync(password, SALT);
    return cryptedPassword;
}

export async function signIn (login : CreateLoginData) {

    const { cpf , password } = login

    const instructor = await instructorsRepository.findCpf(cpf);

    if (!instructor) {
        throw { name: "notFound", message: "Cpf not found"}
    }

    if (!bcrypt.compareSync(password, instructor.password)) {
        throw { name: "notAuthorized", message: "Incorrect password"}
    }

    const token = tokenProvider.encode({id: instructor.id});

    return token;
}