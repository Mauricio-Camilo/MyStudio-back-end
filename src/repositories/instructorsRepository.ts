import { CreateInstructorData } from "../services/instructorsService.js";
import prisma from "./../config/database.js";

export async function findCpf (cpf : string) {
    const instructor = await prisma.instructor.findUnique({where : {cpf}});
    return instructor;
}

export async function registerInstructor (instructor : CreateInstructorData) {
  await prisma.instructor.create({data : instructor})
}
