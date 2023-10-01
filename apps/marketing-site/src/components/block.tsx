import clsx from "clsx";
import { motion } from "framer-motion";
import { useRef } from "react";
import {
  fmAnimate,
  fmFromBelowInitial,
  fmFromLeftInitial,
  fmFromRightInitial,
  fmTransition,
  fmViewport,
} from "src/utils/framerMotionVariants";
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
  const hasText = Boolean(block.copy);

  const scrollRef = useRef(null);

  const textXVariant = imageLeft ? fmFromRightInitial : fmFromLeftInitial;
  const initialTextVariant = hasImages ? textXVariant : fmFromBelowInitial;

  const imageXVariant = imageLeft ? fmFromLeftInitial : fmFromRightInitial;
  const initialImageVariant = hasText ? imageXVariant : fmFromBelowInitial;

  return (
    <div
      className={clsx(
        "flex w-full flex-col items-center gap-y-4 overflow-x-hidden py-12 md:gap-x-10 md:py-20 lg:gap-x-20",
        !hasImages && "text-center",
        hasImages && !imageLeft && "text-center md:flex-row md:text-left",
        hasImages &&
          imageLeft &&
          "text-center md:flex-row-reverse md:text-right",
      )}
      data-testid="generic-block"
      ref={scrollRef}
    >
      {hasText && (
        <motion.div
          className={clsx(hasImages ? "h-full w-full md:w-1/2" : "w-full")}
          initial={initialTextVariant}
          transition={fmTransition}
          viewport={fmViewport}
          whileInView={fmAnimate}
        >
          <CopyComponent copy={block.copy} />
          {hasCtas && (
            <div className="mt-8 flex justify-center space-x-4 md:justify-start">
              {ctas.map((cta, index) => (
                <CTAButton
                  cta={cta}
                  key={`block-${block.uid}-cta-${cta.uid}`}
                  variant={index === 0 ? "primary" : "secondary"}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
      {hasImages && (
        <motion.div
          className={clsx(
            hasText
              ? "h-full w-full md:w-1/2"
              : "flex w-full items-center justify-center",
          )}
          initial={initialImageVariant}
          transition={fmTransition}
          viewport={fmViewport}
          whileInView={fmAnimate}
        >
          <FirstValidImage className={clsx("max-h-96")} images={images} />
        </motion.div>
      )}
    </div>
  );
};

const ImageRailBlock = ({
  hasImages,
  block,
  images,
}: BlockProps & { hasImages?: boolean; images: SkylarkImage[] }) => {
  const hasTitle = Boolean(block.title);

  return (
    <div className="py-16" data-testid="image-rail-block">
      {hasTitle && (
        <motion.p
          className="text-center text-2xl lg:text-3xl"
          initial={fmFromBelowInitial}
          transition={fmTransition}
          viewport={fmViewport}
          whileInView={fmAnimate}
        >
          {block.title}
        </motion.p>
      )}
      {hasImages && (
        <div className="mt-4 flex flex-wrap justify-around gap-4">
          {images.map((image, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              alt={image.title || image.uid}
              className="h-28 rounded-lg shadow md:h-36"
              initial={fmFromBelowInitial}
              key={`block-${block.uid}-image-rail-${image.uid}`}
              src={image?.url || ""}
              transition={{
                ...fmTransition,
                delay: (hasTitle ? 0.7 : 0.3) + 0.2 * i,
              }}
              viewport={fmViewport}
              whileInView={fmAnimate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AccordionBlock = ({ block }: BlockProps) => {
  const accordionItems: AccordionItem[] = block?.content?.objects
    ? (block.content.objects as SetContent[])?.map(({ object }) => {
        const item = object as FrequentlyAskedQuestion;
        return {
          header: item.question || "",
          content: item.answer || "",
        };
      })
    : [];

  return (
    <div className="w-full py-4" data-testid="accordion-block">
      <div className="flex justify-between">
        <p className="text-left text-3xl font-semibold">{block.title}</p>
        {/* <Button variant="primary">{`Expand All`}</Button> */}
      </div>
      <div className="mt-4">
        <Accordion items={accordionItems} />
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
        <AccordionBlock block={block} imageLeft={imageLeft} />
      )}
    </div>
  );
};
