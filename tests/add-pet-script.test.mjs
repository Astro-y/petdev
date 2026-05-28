import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { addPet } from "../scripts/add-pet.mjs";

test("addPet copies assets, appends catalog entry, and creates a release zip", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "petdev-add-pet-"));
  const source = path.join(root, "source");
  await mkdir(source, { recursive: true });
  await writeFile(
    path.join(source, "pet.json"),
    JSON.stringify({
      id: "test-pet",
      displayName: "Test Pet",
      description: "A test pet used by the add-pet helper.",
      spritesheetPath: "spritesheet.webp"
    })
  );
  await writeFile(path.join(source, "spritesheet.webp"), Buffer.from("fake-webp-bytes"));

  const catalogPath = path.join(root, "packages", "petdev", "src", "catalog.js");
  await mkdir(path.dirname(catalogPath), { recursive: true });
  await writeFile(catalogPath, "export const PETS = [];\n");

  try {
    const result = await addPet({
      root,
      source,
      tag: "v9.9.9",
      status: "Fan-made"
    });

    const catalog = await readFile(catalogPath, "utf8");
    const copiedManifest = await readFile(path.join(root, "public", "pets", "test-pet", "pet.json"), "utf8");

    assert.equal(result.id, "test-pet");
    assert.match(catalog, /id: "test-pet"/);
    assert.match(catalog, /npx petdev install test-pet/);
    assert.match(catalog, /v9\.9\.9\/test-pet\.zip/);
    assert.match(copiedManifest, /Test Pet/);
    assert.equal(result.zipPath, path.join(root, "release", "test-pet.zip"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
