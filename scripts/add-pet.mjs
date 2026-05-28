import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const defaultRoot = path.resolve(path.dirname(currentFile), "..");

export async function addPet({
  root = defaultRoot,
  source,
  tag,
  status = "Fan-made",
  zhName,
  zhDescription
}) {
  if (!source) {
    throw new Error("Missing --source <pet-folder>.");
  }
  if (!tag) {
    throw new Error("Missing --tag <release-tag>.");
  }

  const sourceDir = path.resolve(source);
  const manifestPath = path.join(sourceDir, "pet.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const id = manifest.id;

  if (!id || !manifest.displayName || !manifest.description) {
    throw new Error("pet.json must include id, displayName, and description.");
  }

  const spritesheetName = manifest.spritesheetPath || "spritesheet.webp";
  const spritesheetPath = path.join(sourceDir, spritesheetName);
  await stat(spritesheetPath);

  const publicDir = path.join(root, "public", "pets", id);
  await mkdir(publicDir, { recursive: true });
  await copyFile(manifestPath, path.join(publicDir, "pet.json"));
  await copyFile(spritesheetPath, path.join(publicDir, "spritesheet.webp"));

  const releaseDir = path.join(root, "release");
  const zipPath = path.join(releaseDir, `${id}.zip`);
  await mkdir(releaseDir, { recursive: true });
  await createZip([path.join(publicDir, "pet.json"), path.join(publicDir, "spritesheet.webp")], zipPath);

  const catalogPath = path.join(root, "packages", "petdev", "src", "catalog.js");
  await appendCatalogEntry(catalogPath, {
    id,
    displayName: manifest.displayName,
    description: manifest.description,
    status,
    zhName,
    zhDescription,
    tag
  });

  return {
    id,
    publicDir,
    zipPath,
    releaseUrl: `https://github.com/Astro-y/petdev/releases/download/${tag}/${id}.zip`
  };
}

async function appendCatalogEntry(catalogPath, pet) {
  const existing = await readFile(catalogPath, "utf8");
  if (existing.includes(`id: "${pet.id}"`)) {
    throw new Error(`Catalog already contains pet "${pet.id}".`);
  }

  const entry = renderCatalogEntry(pet);

  let next;
  if (/export const PETS = \[\s*\];\s*$/.test(existing)) {
    next = `export const PETS = [\n${entry}\n];\n`;
  } else {
    next = existing.replace(/\n\];\s*$/, `,\n${entry}\n];\n`);
  }

  if (next === existing) {
    throw new Error("Could not find the PETS array closing bracket in catalog.js.");
  }

  await writeFile(catalogPath, next);
}

function renderCatalogEntry(pet) {
  const zhName = pet.zhName || pet.displayName;
  const zhDescription = pet.zhDescription || pet.description;

  return `  {
    id: "${escapeJs(pet.id)}",
    displayName: "${escapeJs(pet.displayName)}",
    description:
      "${escapeJs(pet.description)}",
    localizations: {
      zh: {
        displayName: "${escapeJs(zhName)}",
        description:
          "${escapeJs(zhDescription)}",
        species: "卡通吉祥物",
        status: "同人制作",
        disclaimer:
          "这是一个非官方同人 Codex 桌宠包，仅供个人使用，与原角色权利方无关联，也未获得其背书。"
      }
    },
    species: "Cartoon mascot",
    status: "${escapeJs(pet.status)}",
    creator: "Astro-y",
    version: "${escapeJs(pet.tag)}",
    tags: ["codex-pet"],
    sprite: {
      path: "/pets/${escapeJs(pet.id)}/spritesheet.webp",
      columns: 8,
      rows: 9,
      cellWidth: 192,
      cellHeight: 208,
      idleFrames: 6
    },
    manifestPath: "/pets/${escapeJs(pet.id)}/pet.json",
    releaseZip:
      "https://github.com/Astro-y/petdev/releases/download/${escapeJs(pet.tag)}/${escapeJs(pet.id)}.zip",
    installCommand: "npx petdev install ${escapeJs(pet.id)}",
    installOptions: {
      windows: [
        {
          label: "CLI",
          command: "npx petdev install ${escapeJs(pet.id)}"
        },
        {
          label: "PowerShell",
          command:
            "irm https://petdev.8xy.net/install/${escapeJs(pet.id)}?platform=ps1 | iex"
        }
      ],
      macos: [
        {
          label: "CLI",
          command: "npx petdev install ${escapeJs(pet.id)}"
        },
        {
          label: "Shell",
          command:
            "curl -sSf https://petdev.8xy.net/install/${escapeJs(pet.id)} | sh"
        }
      ],
      linux: [
        {
          label: "CLI",
          command: "npx petdev install ${escapeJs(pet.id)}"
        },
        {
          label: "Shell",
          command:
            "curl -sSf https://petdev.8xy.net/install/${escapeJs(pet.id)} | sh"
        }
      ]
    },
    disclaimer:
      "This is an unofficial fan-made Codex pet package for personal use. It is not affiliated with or endorsed by the original character rights holders."
  }`;
}

async function createZip(files, destination) {
  if (process.platform === "win32") {
    const literalPaths = files.map((file) => `'${escapePowerShell(file)}'`).join(", ");
    await run("powershell", [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      `if (Test-Path -LiteralPath '${escapePowerShell(destination)}') { Remove-Item -LiteralPath '${escapePowerShell(destination)}' -Force }; Compress-Archive -LiteralPath ${literalPaths} -DestinationPath '${escapePowerShell(destination)}' -Force`
    ]);
    return;
  }

  await run("zip", ["-j", destination, ...files]);
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

function escapeJs(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll("\"", "\\\"").replaceAll("\n", "\\n");
}

function escapePowerShell(value) {
  return value.replaceAll("'", "''");
}

function parseArgs(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--source") options.source = argv[++index];
    else if (arg === "--tag") options.tag = argv[++index];
    else if (arg === "--status") options.status = argv[++index];
    else if (arg === "--zh-name") options.zhName = argv[++index];
    else if (arg === "--zh-description") options.zhDescription = argv[++index];
    else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function printHelp() {
  console.log(`add-pet

Usage:
  npm run add:pet -- --source <pet-folder> --tag <release-tag>

Optional:
  --zh-name <name>
  --zh-description <description>
  --status <status>

Example:
  npm run add:pet -- --source "C:\\Users\\you\\.codex\\pets\\my-pet" --tag v1.0.1 --zh-name "我的桌宠"`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      printHelp();
    } else {
      const result = await addPet(options);
      console.log(`Added ${result.id}`);
      console.log(`Public assets: ${result.publicDir}`);
      console.log(`Release zip: ${result.zipPath}`);
      console.log(`Release URL: ${result.releaseUrl}`);
      console.log("Next: upload the zip to that GitHub Release tag, bump packages/petdev/package.json, then npm publish.");
    }
  } catch (error) {
    console.error(`add-pet: ${error.message}`);
    process.exitCode = 1;
  }
}
