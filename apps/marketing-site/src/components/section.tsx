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
    <div className="my-4 bg-white md:my-10" data-testid="default-section">
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
        <p className="mb-12 text-center text-3xl font-semibold lg:text-4xl">
          {section.title}
        </p>
      )}
      <div className="grid grid-cols-1 items-start justify-around gap-8 md:grid-cols-2">
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
        <h3 className="text-center text-4xl font-semibold lg:text-5xl">
          {section.title}
        </h3>
      )}
      <div className="grid h-full w-full grow grid-cols-4 gap-4 py-16 lg:gap-10">
        <div className="col-span-1 h-full rounded-lg bg-gray-100 p-2 md:p-4 lg:p-8">
          <ul className="mt-6 border-gray-200 lg:mt-8 lg:border-l-2 lg:pl-4">
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
