"use client";

import Link from "next/link";
import { LanguageToggle, useLanguage } from "./language-provider";
import { SpritePreview } from "./sprite-preview";

type CatalogPet = {
  id: string;
  displayName: string;
  description: string;
  status: string;
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

export function CatalogClient({ pets }: { pets: CatalogPet[] }) {
  const { dictionary, language, petCopy } = useLanguage();
  const countLabel = pets.length === 1 ? dictionary.common.pet : dictionary.common.pets;

  return (
    <main className="shell">
      <section className="catalogHero">
        <div>
          <div className="topLine">
            <p className="eyebrow">{dictionary.catalog.eyebrow}</p>
            <LanguageToggle />
          </div>
          <h1>{dictionary.catalog.title}</h1>
          <p className="lede">{dictionary.catalog.lede}</p>
        </div>
        <div className="heroBadge" aria-label={`${pets.length} ${countLabel}`}>
          <strong>{pets.length}</strong>
          <span>{countLabel}</span>
        </div>
      </section>

      <section className="petGrid" aria-label={dictionary.catalog.availablePets}>
        {pets.map((pet) => {
          const copy = petCopy(pet, language);

          return (
            <Link className="petCard" href={`/pets/${pet.id}`} key={pet.id}>
              <SpritePreview pet={copy} size="small" />
              <div className="petCardBody">
                <div>
                  <p className="status">{copy.status}</p>
                  <h2>{copy.displayName}</h2>
                </div>
                <p>{copy.description}</p>
                <div className="tagRow">
                  {pet.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}

