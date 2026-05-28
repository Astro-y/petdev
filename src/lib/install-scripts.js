export function getInstallScript(pet, platform = "sh") {
  if (platform === "ps1") {
    return {
      contentType: "text/plain; charset=utf-8",
      body: powershellScript(pet)
    };
  }

  if (platform === "sh" || !platform) {
    return {
      contentType: "text/x-shellscript; charset=utf-8",
      body: shellScript(pet)
    };
  }

  throw new Error(`Unsupported platform "${platform}".`);
}

function powershellScript(pet) {
  return [
    "$ErrorActionPreference = 'Stop'",
    `$pet = '${escapePowerShell(pet.id)}'`,
    `$url = '${escapePowerShell(pet.releaseZip)}'`,
    "$zip = Join-Path $env:TEMP \"$pet.zip\"",
    "$dest = Join-Path $env:USERPROFILE \".codex\\pets\\$pet\"",
    "Invoke-WebRequest -Uri $url -OutFile $zip",
    "New-Item -ItemType Directory -Path $dest -Force | Out-Null",
    "Expand-Archive -LiteralPath $zip -DestinationPath $dest -Force",
    "Write-Host \"Installed $pet\"",
    "Write-Host \"Open Codex settings, choose Appearance -> Pets, then select this pet.\"",
    ""
  ].join("\n");
}

function shellScript(pet) {
  return [
    "#!/bin/sh",
    "set -eu",
    `pet='${escapeShell(pet.id)}'`,
    `url='${escapeShell(pet.releaseZip)}'`,
    'zip="${TMPDIR:-/tmp}/$pet.zip"',
    'dest="$HOME/.codex/pets/$pet"',
    'curl -fL "$url" -o "$zip"',
    'mkdir -p "$dest"',
    'unzip -o "$zip" -d "$dest" >/dev/null',
    'printf "Installed %s\\n" "$pet"',
    'printf "Open Codex settings, choose Appearance -> Pets, then select this pet.\\n"',
    ""
  ].join("\n");
}

function escapePowerShell(value) {
  return String(value).replaceAll("'", "''");
}

function escapeShell(value) {
  return String(value).replaceAll("'", "'\"'\"'");
}
