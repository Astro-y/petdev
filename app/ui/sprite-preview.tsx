import type { CSSProperties } from "react";

type SpritePet = {
  displayName: string;
  sprite: {
    path: string;
    columns: number;
    rows: number;
    cellWidth: number;
    cellHeight: number;
    idleFrames: number;
  };
};

export function SpritePreview({
  pet,
  size
}: {
  pet: SpritePet;
  size: "small" | "large";
}) {
  const scale = size === "large" ? 1.45 : 0.82;
  const width = pet.sprite.cellWidth * scale;
  const height = pet.sprite.cellHeight * scale;

  return (
    <div className={`spriteStage spriteStage-${size}`}>
      <div
        className="sprite"
        role="img"
        aria-label={`${pet.displayName} animated idle preview`}
        style={
          {
            width,
            height,
            "--sprite-url": `url(${pet.sprite.path})`,
            "--frame-width": `${pet.sprite.cellWidth}px`,
            "--frame-height": `${pet.sprite.cellHeight}px`,
            "--sheet-width": `${pet.sprite.columns * pet.sprite.cellWidth}px`,
            "--sheet-height": `${pet.sprite.rows * pet.sprite.cellHeight}px`,
            "--preview-scale": scale,
            "--idle-distance": `-${pet.sprite.cellWidth * pet.sprite.idleFrames}px`
          } as CSSProperties
        }
      />
    </div>
  );
}
