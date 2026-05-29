"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getTagLabel } from "../../src/lib/i18n";
import { CopyCommand } from "./copy-command";
import { LanguageToggle, useLanguage } from "./language-provider";
import { SpritePreview } from "./sprite-preview";

type DetailPet = {
  id: string;
  displayName: string;
  description: string;
  status: string;
  creator: string;
  version: string;
  releaseZip: string;
  installCommand: string;
  installOptions?: Record<string, Array<{ label: string; command: string }>>;
  disclaimer: string;
  tags: string[];
  sprite: {
    path: string;
    columns: number;
    rows: number;
    cellWidth: number;
    cellHeight: number;
    idleFrames: number;
  };
};

export function PetDetailClient({ pet }: { pet: DetailPet }) {
  const { dictionary, language, petCopy } = useLanguage();
  const copy = petCopy(pet, language);
  const installOptions = useMemo(() => normalizeInstallOptions(pet), [pet]);
  const platforms = Object.keys(installOptions);
  const [platform, setPlatform] = useState(platforms[0] || "windows");
  const [methodIndex, setMethodIndex] = useState(0);
  const [siteOrigin, setSiteOrigin] = useState("");
  const methods = installOptions[platform] || installOptions[platforms[0]] || [];
  const selectedMethod = methods[methodIndex] || methods[0];
  const selectedCommand = useMemo(
    () => localizeInstallCommand(selectedMethod?.command || "", siteOrigin),
    [selectedMethod?.command, siteOrigin]
  );

  useEffect(() => {
    setSiteOrigin(window.location.origin);
  }, []);

  return (
    <main className="shell detailShell">
      <div className="detailTop">
        <Link className="backLink" href="/">
          {dictionary.detail.back}
        </Link>
        <LanguageToggle />
      </div>

      <section className="detailHero">
        <div className="previewPanel">
          <SpritePreview pet={copy} size="large" />
        </div>
        <div className="detailIntro">
          <p className="eyebrow">{copy.status}</p>
          <h1>{copy.displayName}</h1>
          <p className="lede">{copy.description}</p>
          <div className="tagRow">
            {pet.tags.map((tag) => (
              <span key={tag}>{getTagLabel(tag, language)}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="detailGrid">
        <article className="installPanel">
          <div>
            <p className="eyebrow">{dictionary.detail.installEyebrow}</p>
            <h2>{dictionary.detail.installTitle}</h2>
            <p>{dictionary.detail.installBody}</p>
          </div>
          <div className="installTabs" aria-label="Operating system">
            {platforms.map((item) => (
              <button
                className={platform === item ? "active" : ""}
                key={item}
                onClick={() => {
                  setPlatform(item);
                  setMethodIndex(0);
                }}
                type="button"
              >
                {platformLabels[item] || item}
              </button>
            ))}
          </div>
          <div className="installTabs installTabs-secondary" aria-label="Install method">
            {methods.map((method, index) => (
              <button
                className={methodIndex === index ? "active" : ""}
                key={method.label}
                onClick={() => setMethodIndex(index)}
                type="button"
              >
                {method.label}
              </button>
            ))}
          </div>
          <CopyCommand command={selectedCommand} labels={dictionary.detail} />
        </article>

        <article className="infoPanel">
          <p className="eyebrow">{dictionary.detail.petFile}</p>
          <dl>
            <div>
              <dt>{dictionary.detail.petId}</dt>
              <dd>{pet.id}</dd>
            </div>
            <div>
              <dt>{dictionary.detail.creator}</dt>
              <dd>{pet.creator}</dd>
            </div>
            <div>
              <dt>{dictionary.detail.version}</dt>
              <dd>{pet.version}</dd>
            </div>
            <div>
              <dt>{dictionary.detail.release}</dt>
              <dd>
                <a href={pet.releaseZip}>{dictionary.detail.githubZip}</a>
              </dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="notice">
        <p>{copy.disclaimer}</p>
      </section>
    </main>
  );
}

function localizeInstallCommand(command: string, siteOrigin: string) {
  if (!siteOrigin) {
    return command;
  }

  return command.replaceAll("https://petdev.8xy.net", siteOrigin);
}

const platformLabels: Record<string, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux"
};

function normalizeInstallOptions(pet: DetailPet) {
  if (pet.installOptions) {
    return pet.installOptions;
  }

  return {
    windows: [{ label: "CLI", command: pet.installCommand }],
    macos: [{ label: "CLI", command: pet.installCommand }],
    linux: [{ label: "CLI", command: pet.installCommand }]
  };
}
