import { notFound } from "next/navigation";
import { pets } from "../../../src/lib/pets.js";
import { PetDetailClient } from "../../ui/pet-detail-client";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return pets.map((pet) => ({ id: pet.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const pet = pets.find((entry) => entry.id === id);
  return {
    title: pet ? `${pet.displayName} | Petdev` : "Pet not found | Petdev"
  };
}

export default async function PetPage({ params }: Props) {
  const { id } = await params;
  const pet = pets.find((entry) => entry.id === id);

  if (!pet) {
    notFound();
  }

  return <PetDetailClient pet={pet} />;
}
