import { PETS } from "./catalog.js";

export const pets = PETS;

export function findPet(id) {
  const pet = pets.find((entry) => entry.id === id);
  if (!pet) {
    const available = pets.map((entry) => entry.id).join(", ");
    throw new Error(`Unknown pet "${id}". Available pets: ${available}`);
  }
  return pet;
}

export function formatList() {
  return [
    "Available pets:",
    "",
    ...pets.map((pet) =>
      [
        `- ${pet.displayName}`,
        `  id: ${pet.id}`,
        `  status: ${pet.status}`,
        `  install: ${pet.installCommand}`
      ].join("\n")
    ),
    "",
    "Browse: https://petdev.8xy.net/"
  ].join("\n");
}

export function formatInfo(id) {
  const pet = findPet(id);

  return [
    `${pet.displayName}`,
    `id: ${pet.id}`,
    `description: ${pet.description}`,
    `version: ${pet.version}`,
    `release: ${pet.releaseZip}`,
    `install: ${pet.installCommand}`,
    `tags: ${pet.tags.join(", ")}`
  ].join("\n");
}
