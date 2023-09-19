import clsx from "clsx";
import {
  Block,
  BlockAppearance,
  BlockType,
  SkylarkImage,
} from "../../types/gql";
import { CopyComponent } from "./copy";
import { FirstValidImage } from "./image";

interface BlockProps {
  block: Block;
  imageLeft?: boolean;
}

export const BlockComponent = ({ block, imageLeft }: BlockProps) => {
  const type = block.type as BlockType;
  const appearance = block.appearance as BlockAppearance;

  const images =
    block.images?.objects && block.images.objects.length > 0
      ? (block.images?.objects as SkylarkImage[])
      : [];

  const hasImages = images && images.length > 0;

  return (
    <div
      className={clsx(
        "gutter w-full",
        appearance === BlockAppearance.Light && "bg-white text-skylark-black",
        appearance === BlockAppearance.Primary && "bg-skylark-blue text-white",
        appearance === BlockAppearance.Dark && "bg-skylark-black text-white",
        appearance === BlockAppearance.Neutral &&
          "bg-gray-300 text-skylark-black",
      )}
    >
      {(type === BlockType.Generic || !type) && (
        <div
          className={clsx(
            "grid w-full items-center gap-4 py-20",
            hasImages ? "grid-cols-2" : "grid-cols-1 text-center",
            hasImages && !imageLeft && "text-left",
            hasImages && imageLeft && "text-right",
          )}
        >
          {hasImages && imageLeft && <FirstValidImage images={images} />}
          <CopyComponent copy={block.copy} />
          {hasImages && !imageLeft && <FirstValidImage images={images} />}
        </div>
      )}
      {type === BlockType.ImageRail && (
        <div className="py-16">
          <p className="text-center text-3xl">{block.title}</p>
          {hasImages && (
            <div className="mt-4 flex justify-around">
              {images.map((image) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={image.title || image.uid}
                  className="h-36 rounded-lg shadow"
                  key={image.uid}
                  src={image?.url || ""}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
