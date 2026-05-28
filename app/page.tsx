import { pets } from "../src/lib/pets.js";
import { CatalogClient } from "./ui/catalog-client";

export default function CatalogPage() {
  return <CatalogClient pets={pets} />;
}
