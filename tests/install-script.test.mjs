import assert from "node:assert/strict";
import test from "node:test";

import { findPet } from "../packages/petdev/src/registry.js";
import { getInstallScript } from "../src/lib/install-scripts.js";

test("generates a PowerShell installer for Windows", () => {
  const pet = findPet("pajamas-crayon-shin-chan");
  const script = getInstallScript(pet, "ps1");

  assert.match(script.body, /Invoke-WebRequest/);
  assert.match(script.body, /Expand-Archive/);
  assert.match(script.body, /pajamas-crayon-shin-chan/);
  assert.equal(script.contentType, "text/plain; charset=utf-8");
});

test("generates a shell installer for macOS and Linux", () => {
  const pet = findPet("pajamas-crayon-shin-chan");
  const script = getInstallScript(pet, "sh");

  assert.match(script.body, /curl -fL/);
  assert.match(script.body, /unzip -o/);
  assert.match(script.body, /\$HOME\/\.codex\/pets/);
  assert.equal(script.contentType, "text/x-shellscript; charset=utf-8");
});

test("rejects unsupported install script platforms", () => {
  const pet = findPet("pajamas-crayon-shin-chan");

  assert.throws(() => getInstallScript(pet, "bat"), /Unsupported platform/);
});
