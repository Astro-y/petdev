# Petdev

A Vercel-ready multi-pet catalog for Codex desktop pets, plus the `petdev` npm CLI.

## Install A Pet

```powershell
npx petdev install pajamas-crayon-shin-chan
```

The CLI downloads the pet package from the `Astro-y/petdev` GitHub Releases page and installs it into the local Codex pets directory.

## Development

```powershell
npm install
npm run dev
npm run test:cli
npm run build
```

## Release Asset

The first pet package is prepared at:

```text
release/pajamas-crayon-shin-chan.zip
```

Upload that file to GitHub Release `v1.0.0` before publishing the `petdev` npm package.

