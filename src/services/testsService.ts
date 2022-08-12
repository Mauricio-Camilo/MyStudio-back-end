import * as testsRepository from "./../repositories/testsRepository.js"

export async function resetDatabase() {
  await testsRepository.resetDatabase();
}

export async function seedDatabase() {
    await testsRepository.seedDatabase();
  }


