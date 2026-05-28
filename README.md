# Petdev

A Vercel-ready multi-pet catalog for Codex desktop pets, plus the `petdev` npm CLI.

Chinese documentation is available in [README.zh-CN.md](README.zh-CN.md).

## Choose And Install A Pet

```powershell
npx petdev list
```

Or browse the catalog:

```text
https://petdev.8xy.net/
```

Then install the pet you want:

```powershell
npx petdev install <pet-id>
```

The CLI downloads the selected pet package from the `Astro-y/petdev` GitHub Releases page and installs it into the local Codex pets directory.

## Development

```powershell
npm install
npm run dev
npm test
npm run build
```

## Release Asset

The first pet package is prepared at:

```text
release/pajamas-crayon-shin-chan.zip
```

Upload that file to GitHub Release `v1.0.0` before publishing the `petdev` npm package.

## Add Another Pet

Put a valid Codex pet folder somewhere with `pet.json` and `spritesheet.webp`, then run:

```powershell
npm run add:pet -- --source "C:\path\to\pet-folder" --tag v1.0.1 --zh-name "Chinese Name"
```

The helper copies assets into `public/pets/<pet-id>/`, appends `packages/petdev/src/catalog.js`, and creates `release/<pet-id>.zip`. After that, upload the ZIP to the matching GitHub Release tag, bump `packages/petdev/package.json`, and publish npm again.
