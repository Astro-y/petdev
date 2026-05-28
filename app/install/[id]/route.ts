import { NextResponse } from "next/server";
import { getInstallScript } from "../../../src/lib/install-scripts.js";
import { pets } from "../../../src/lib/pets.js";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return pets.map((pet) => ({ id: pet.id }));
}

export async function GET(request: Request, { params }: Props) {
  const { id } = await params;
  const pet = pets.find((entry) => entry.id === id);

  if (!pet) {
    return new NextResponse("Unknown pet\n", { status: 404 });
  }

  const url = new URL(request.url);
  const platform = url.searchParams.get("platform") || "sh";

  try {
    const script = getInstallScript(pet, platform);
    return new NextResponse(script.body, {
      headers: {
        "Content-Type": script.contentType,
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (error) {
    return new NextResponse(`${(error as Error).message}\n`, { status: 400 });
  }
}
