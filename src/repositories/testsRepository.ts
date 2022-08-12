import  prisma  from "./../config/database.js";

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
}