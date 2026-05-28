import assert from "node:assert/strict";
import test from "node:test";

import { languages, getDictionary, getPetCopy } from "../src/lib/i18n.js";
import { findPet } from "../packages/petdev/src/registry.js";

test("supports English and Chinese dictionaries with English fallback", () => {
  assert.deepEqual(languages.map((language) => language.code), ["en", "zh"]);
  assert.equal(getDictionary("en").catalog.title, "Petdev Island");
  assert.equal(getDictionary("zh").catalog.title, "Petdev 岛屿");
  assert.equal(getDictionary("missing").common.languageToggleLabel, "Language");
});

test("returns localized pet copy when available", () => {
  const pet = findPet("pajamas-crayon-shin-chan");

  assert.equal(getPetCopy(pet, "en").displayName, "Pajamas Crayon Shin-chan");
  assert.equal(getPetCopy(pet, "zh").displayName, "睡衣蜡笔小新");
  assert.match(getPetCopy(pet, "zh").disclaimer, /非官方/);
});
