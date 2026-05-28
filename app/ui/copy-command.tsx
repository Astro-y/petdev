"use client";

import { useState } from "react";

export function CopyCommand({
  command,
  labels = { copy: "Copy", copied: "Copied" }
}: {
  command: string;
  labels?: { copy: string; copied: string };
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="commandBox">
      <code>{command}</code>
      <button type="button" onClick={copy}>
        {copied ? labels.copied : labels.copy}
      </button>
    </div>
  );
}
