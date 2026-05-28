import { createWriteStream } from "node:fs";
import { mkdir, mkdtemp, rm, stat } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import { findPet } from "./registry.js";

export function getCodexHome(override) {
  return override || process.env.CODEX_HOME || path.join(homedir(), ".codex");
}

export async function installPet(id, options = {}) {
  const pet = findPet(id);
  const codexHome = getCodexHome(options.codexHome);
  const petDir = path.join(codexHome, "pets", pet.id);
  const workDir = await mkdtemp(path.join(tmpdir(), "petdev-"));
  const archivePath = path.join(workDir, `${pet.id}.zip`);
  const archiveUrl = options.archiveUrl || pet.releaseZip;

  try {
    await mkdir(petDir, { recursive: true });
    await fetchArchive(archiveUrl, archivePath);
    await extractArchive(archivePath, petDir);
    await validatePetPackage(petDir);

    return {
      pet,
      petDir
    };
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

async function fetchArchive(source, destination) {
  if (isLocalPath(source)) {
    const { copyFile } = await import("node:fs/promises");
    await copyFile(source, destination);
    return;
  }

  const response = await fetch(source);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${source}: ${response.status} ${response.statusText}`);
  }

  await pipeline(response.body, createWriteStream(destination));
}

function isLocalPath(value) {
  if (value.startsWith("file:")) return true;
  if (/^[a-z]+:\/\//i.test(value)) return false;
  return true;
}

async function extractArchive(archivePath, destination) {
  if (process.platform === "win32") {
    await run("powershell", [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      `Expand-Archive -LiteralPath '${escapePowerShell(archivePath)}' -DestinationPath '${escapePowerShell(destination)}' -Force`
    ]);
    return;
  }

  await run("unzip", ["-o", archivePath, "-d", destination]);
}

function escapePowerShell(value) {
  return value.replaceAll("'", "''");
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "pipe" });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} exited with code ${code}: ${stderr.trim()}`));
    });
  });
}

async function validatePetPackage(petDir) {
  const manifest = path.join(petDir, "pet.json");
  const spritesheet = path.join(petDir, "spritesheet.webp");

  await stat(manifest);
  await stat(spritesheet);
}

export function fileUrlToPath(url) {
  return fileURLToPath(url);
}

