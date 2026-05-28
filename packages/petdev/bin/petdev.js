#!/usr/bin/env node
import { installPet } from "../src/install.js";
import { formatInfo, formatList } from "../src/registry.js";

const [, , command, petId] = process.argv;

try {
  if (!command || command === "--help" || command === "-h") {
    printHelp();
  } else if (command === "list") {
    console.log(formatList());
  } else if (command === "info") {
    requirePetId(petId, "info");
    console.log(formatInfo(petId));
  } else if (command === "install") {
    requirePetId(petId, "install");
    const result = await installPet(petId);
    console.log(`Installed ${result.pet.displayName}`);
    console.log(`Location: ${result.petDir}`);
    console.log("Open Codex settings, choose Appearance -> Pets, then select this pet.");
  } else {
    throw new Error(`Unknown command "${command}".`);
  }
} catch (error) {
  console.error(`petdev: ${error.message}`);
  process.exitCode = 1;
}

function requirePetId(value, commandName) {
  if (!value) {
    throw new Error(
      `Usage: petdev ${commandName} <pet-id>\nRun "npx petdev list" first, or browse https://petdev.8xy.net/ to choose a pet.`
    );
  }
}

function printHelp() {
  console.log(`petdev

Usage:
  petdev list
  petdev info <pet-id>
  petdev install <pet-id>

Choose a pet:
  npx petdev list
  https://petdev.8xy.net/

Install:
  npx petdev install <pet-id>`);
}
