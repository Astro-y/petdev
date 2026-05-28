import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { pets } from "../src/lib/pets.js";
import { findPet, formatInfo, formatList } from "../packages/petdev/src/registry.js";
import { installPet } from "../packages/petdev/src/install.js";

test("catalog exposes the first pet and its public install command", () => {
  const pet = findPet("pajamas-crayon-shin-chan");

  assert.equal(pet.id, "pajamas-crayon-shin-chan");
  assert.equal(pet.displayName, "Pajamas Crayon Shin-chan");
  assert.equal(pet.installCommand, "npx petdev install pajamas-crayon-shin-chan");
  assert.equal(pets.length, 1);
});

test("list and info commands render catalog content", () => {
  assert.match(formatList(), /pajamas-crayon-shin-chan\s+Pajamas Crayon Shin-chan/);
  assert.match(formatInfo("pajamas-crayon-shin-chan"), /npx petdev install pajamas-crayon-shin-chan/);
});

test("install command extracts a pet package into the Codex pets directory", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "petdev-test-"));
    const fixtureZip = path.resolve("release", "pajamas-crayon-shin-chan.zip");

  try {
    const result = await installPet("pajamas-crayon-shin-chan", {
      codexHome: tempRoot,
      archiveUrl: fixtureZip
    });

    const petDir = path.join(tempRoot, "pets", "pajamas-crayon-shin-chan");
    const manifest = JSON.parse(await readFile(path.join(petDir, "pet.json"), "utf8"));
    const spritesheet = await stat(path.join(petDir, "spritesheet.webp"));

    assert.equal(result.petDir, petDir);
    assert.equal(manifest.id, "pajamas-crayon-shin-chan");
    assert.ok(spritesheet.size > 1000);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
