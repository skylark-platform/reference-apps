import clsx from "clsx";
import {
  Block,
  Section,
  SectionType,
  SetContent,
  Testimonial,
} from "../../types/gql";
import { BlockComponent } from "./block";
import { TestimonialCard } from "./testimonialCard";

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
    <div className="my-10 bg-white">
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
    <div className="gutter my-20 w-full bg-gray-100 py-16">
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
    </>
  );
};
