import { CreateInstructorData } from "../services/instructorsService.js";
import prisma from "./../config/database.js";

async function findCpf (cpf : string) {
    const instructor = await prisma.instructor.findUnique({where : {cpf}});
    return instructor;
}

async function registerInstructor (instructor : CreateInstructorData) {
  await prisma.instructor.create({data : instructor})
}

export const instructorsRepository = {
  findCpf,
  registerInstructor
}


