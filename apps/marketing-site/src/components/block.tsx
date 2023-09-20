import clsx from "clsx";
import {
  Block,
  BlockAppearance,
  BlockType,
  CallToAction,
  FrequentlyAskedQuestion,
  SetContent,
  SkylarkImage,
} from "../../types/gql";
import { CopyComponent } from "./copy";
import { FirstValidImage } from "./image";
import { Accordion, AccordionItem } from "./accordian";
import { Button } from "./button";
import { CTAButton } from "./cta";

interface BlockProps {
  block: Block;
  imageLeft?: boolean;
}

const GenericBlock = ({
  block,
  imageLeft,
  hasImages,
  images,
}: BlockProps & { hasImages?: boolean; images: SkylarkImage[] }) => {
  const ctas =
    block.call_to_actions?.objects && block.call_to_actions.objects.length > 0
      ? (block.call_to_actions?.objects as CallToAction[]).slice(0, 1)
      : [];

  const hasCtas = block.type === BlockType.Generic && ctas.length > 0; // TODO change to GenericWithCtas

  return (
    <div
      className={clsx(
        "grid w-full items-center gap-x-4 py-20 md:gap-x-10 lg:gap-x-20",
        hasImages ? "grid-cols-2" : "grid-cols-1 text-center",
        hasImages && !imageLeft && "text-left",
        hasImages && imageLeft && "text-right",
      )}
    >
      {hasImages && imageLeft && <FirstValidImage images={images} />}
      <div className="w-full">
        <CopyComponent copy={block.copy} />
        {hasCtas && (
          <div className="mt-8 flex justify-start space-x-4">
            {ctas.map((cta, index) => (
              <CTAButton
                cta={cta}
                key={`block-${block.uid}-cta-${cta.uid}`}
                variant={index === 0 ? "primary" : "secondary"}
              />
            ))}
          </div>
        )}
      </div>
      {hasImages && !imageLeft && <FirstValidImage images={images} />}
    </div>
  );
};

const ImageRailBlock = ({
  hasImages,
  block,
  images,
}: BlockProps & { hasImages?: boolean; images: SkylarkImage[] }) => (
  <div className="py-16">
    <p className="text-center text-3xl">{block.title}</p>
    {hasImages && (
      <div className="mt-4 flex justify-around">
        {images.map((image) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={image.title || image.uid}
            className="h-36 rounded-lg shadow"
            key={`block-${block.uid}-image-rail-${image.uid}`}
            src={image?.url || ""}
          />
        ))}
      </div>
    )}
  </div>
);

const AccordianBlock = ({ block }: BlockProps) => {
  const accordianItems: AccordionItem[] = block?.content?.objects
    ? (block.content.objects as SetContent[])?.map(({ object }) => {
        const item = object as FrequentlyAskedQuestion;
        return {
          header: item.question || "",
          content: item.answer || "",
        };
      })
    : [];

  return (
    <div className="w-full py-4">
      <div className="flex justify-between">
        <p className="text-left text-3xl font-semibold">{block.title}</p>
        <Button variant="primary">{`Expand All`}</Button>
      </div>
      <div className="mt-4">
        <Accordion items={accordianItems} />
      </div>
    </div>
  );
};

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
        "w-full",
        type !== BlockType.Accordian && "gutter",
        appearance === BlockAppearance.Light && "bg-white text-skylark-black",
        appearance === BlockAppearance.Primary && "bg-skylark-blue text-white",
        appearance === BlockAppearance.Dark && "bg-skylark-black text-white",
        appearance === BlockAppearance.Neutral &&
          "bg-gray-300 text-skylark-black",
      )}
    >
      {(type === BlockType.Generic || !type) && (
        <GenericBlock
          block={block}
          hasImages={hasImages}
          imageLeft={imageLeft}
          images={images}
        />
      )}
      {type === BlockType.ImageRail && (
        <ImageRailBlock
          block={block}
          hasImages={hasImages}
          imageLeft={imageLeft}
          images={images}
        />
      )}
      {type === BlockType.Accordian && (
        <AccordianBlock block={block} imageLeft={imageLeft} />
      )}
    </div>
  );
};
