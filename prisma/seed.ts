import prisma from "./../src/config/database.js";

async function main () {
    // await prisma.$transaction([
    //     prisma.$executeRaw`TRUNCATE TABLE instructors RESTART IDENTITY`,
    //     prisma.$executeRaw`TRUNCATE TABLE clients CASCADE RESTART IDENTITY`,
    //     prisma.$executeRaw`TRUNCATE TABLE payments CASCADE RESTART IDENTITY`,
    //     prisma.$executeRaw`INSERT INTO payments (period) VALUES ('Mensal') CASCADE`,
    //     prisma.$executeRaw`INSERT INTO payments (period) VALUES ('Trimestral') CASCADE`,
    //     prisma.$executeRaw`INSERT INTO payments (period) VALUES ('Semestral') CASCADE`,
    //     prisma.$executeRaw`INSERT INTO payments (period) VALUES ('Anual') CASCADE`,
    //   ]);
}

main().catch(e => {
    console.log(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})