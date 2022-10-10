import bcrypt from 'bcrypt';
import { Instructor } from '@prisma/client';
import { tokenProvider } from "./../providers/tokenProvider.js"
import { instructorsRepository } from "./../repositories/instructorsRepository.js";

export type CreateInstructorData = Omit<Instructor, "id">
export type CreateLoginData = Omit<Instructor, "id"|"name">

async function registerInstructor (instructor : CreateInstructorData, confirmPassword : string) {

    const {cpf, password} = instructor;

    const checkCpf = await instructorsRepository.findCpf(cpf);
        
    if (checkCpf) {
        throw { name: "alreadyExists", message: "Cpf already exists"}
    }

    const cryptedPassword = cryptPassword(password);
    
    await instructorsRepository.registerInstructor({...instructor, password: cryptedPassword});
}

function cryptPassword (password : string) {
    const SALT = 10;
    const cryptedPassword = bcrypt.hashSync(password, SALT);
    return cryptedPassword;
}

async function signIn (login : CreateLoginData) {

    const { cpf , password } = login

    const instructor = await instructorsRepository.findCpf(cpf);

    if (!instructor) {
        throw { name: "notFound", message: "CPF não encontrado"}
    }

    const checkPassword : boolean = await instructorsService.comparePassword(password, instructor.password);

    if (!checkPassword) {
        throw { name: "notAuthorized", message: "Senha incorreta"}
    }

    const token = tokenProvider.encode({id: instructor.id});

    return token;
}

async function comparePassword (password : string , hashPassword : string) {
    return bcrypt.compareSync(password, hashPassword)
}

export const instructorsService = {
    registerInstructor,
    cryptPassword,
    signIn,
    comparePassword
}