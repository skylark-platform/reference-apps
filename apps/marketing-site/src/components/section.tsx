import clsx from "clsx";
import { useState } from "react";
import {
  Block,
  Section,
  SectionType,
  SetContent,
  Testimonial,
} from "../../types/gql";
import { BlockComponent } from "./block";
import { TestimonialCard } from "./testimonialCard";
import { Button } from "./button";

interface SectionProps {
  section: Section;
}

const DefaultSectionComponent = ({ section }: SectionProps) => {
  const blocks = section?.content?.objects
    ? (section.content.objects as SetContent[])?.map(
        ({ object }) => object as Block,
      )
    : [];

  return (
    <div className="my-10 bg-white" data-testid="default-section">
      {blocks?.map((block, index) => (
        <div
          className={clsx("w-full", index !== blocks.length - 1 && "border-b")}
          key={block.uid}
        >
          <BlockComponent block={block} imageLeft={index % 2 === 1} />
        </div>
      ))}
    </div>
  );
};

const TestimonialSectionComponent = ({ section }: SectionProps) => {
  const testimonials = section?.content?.objects
    ? (section.content.objects as SetContent[])?.map(
        ({ object }) => object as Testimonial,
      )
    : [];

  return (
    <div
      className="gutter my-10 w-full bg-gray-100 py-16"
      data-testid="testimonial-section"
    >
      {section.title && (
        <p className="mb-12 text-center text-4xl font-semibold">
          {section.title}
        </p>
      )}
      <div className="flex justify-around gap-8">
        {testimonials?.map((testimonial) => (
          <TestimonialCard key={testimonial.uid} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
};

const VerticalTabsSection = ({ section }: SectionProps) => {
  const blocks = section?.content?.objects
    ? (section.content.objects as SetContent[])?.map(
        ({ object }) => object as Block,
      )
    : [];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      className="gutter my-10 flex min-h-[80vh] w-full flex-col bg-white"
      data-testid="vertical-tabs-section"
    >
      {section.title && (
        <h3 className="text-center text-5xl font-semibold">{section.title}</h3>
      )}
      <div className="grid h-full w-full grow grid-cols-4 gap-10 py-16">
        <div className="col-span-1 h-full rounded-lg bg-gray-100 p-8">
          {/* <p className="text-2xl font-semibold">{`Key`}</p> */}
          <ul className="mt-8 border-l-2 border-gray-200 pl-4">
            {blocks.map((block, index) => (
              <li className="my-8" key={block.uid}>
                <Button
                  disableHover={index === activeIndex}
                  variant={index === activeIndex ? "primary" : "tertiary"}
                  onClick={() => setActiveIndex(index)}
                >
                  {block.title}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-3 h-full rounded-lg bg-gray-100 p-8">
          {blocks[activeIndex] && (
            <BlockComponent block={blocks[activeIndex]} />
          )}
        </div>
      </div>
    </div>
  );
};

export const SectionComponent = ({ section }: SectionProps) => {
  const type = section.type as SectionType;

  return (
    <>
      {type === SectionType.Default && (
        <DefaultSectionComponent section={section} />
      )}
      {type === SectionType.TestimonialCards && (
        <TestimonialSectionComponent section={section} />
      )}
      {type === SectionType.TabsVertical && (
        <VerticalTabsSection section={section} />
      )}
    </>
  );
};
