import prisma from "./../config/database.js";

export async function findPaymentMethod (id: number) {
    const payment = await prisma.payment.findFirst({where: {id}});
    return payment.period;
  }