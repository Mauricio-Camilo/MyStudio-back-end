import  prisma  from "./../config/database.js";
import bcrypt from "bcrypt";

export async function resetDatabase() {
    await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE clients RESTART IDENTITY`,
        prisma.$executeRaw`TRUNCATE TABLE payments RESTART IDENTITY CASCADE`,
        prisma.$executeRaw`TRUNCATE TABLE instructors RESTART IDENTITY CASCADE`,
      ]);
}

export async function seedDatabase() {
    await prisma.$transaction([
        prisma.$executeRaw`INSERT INTO payments (period) VALUES ('Mensal')`,
        prisma.$executeRaw`INSERT INTO payments (period) VALUES ('Trimestral')`,
        prisma.$executeRaw`INSERT INTO payments (period) VALUES ('Semestral')`,
        prisma.$executeRaw`INSERT INTO payments (period) VALUES ('Anual')`,
    ])
    await prisma.instructor.create({
        data: {
            name: "Instrutor1",
            cpf: "000.000.000-00",
            password: bcrypt.hashSync("password",10)
        }
    })
}