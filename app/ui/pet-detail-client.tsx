"use client";

import Link from "next/link";
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
              <span key={tag}>{tag}</span>
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
          <CopyCommand command={pet.installCommand} labels={dictionary.detail} />
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
