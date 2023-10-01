import Link from "next/link";
import { motion } from "framer-motion";
import {
  fmAnimate,
  fmFromBelowInitial,
  fmTransition,
  fmViewport,
} from "src/utils/framerMotionVariants";
import { Testimonial } from "../../types/gql";
import { Button } from "./button";
import { FirstValidImage } from "./image";

export interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard = ({ testimonial }: TestimonialCardProps) => (
  <motion.div
    className="mx-auto flex w-full max-w-md flex-col items-center md:items-start"
    initial={fmFromBelowInitial}
    transition={fmTransition}
    viewport={fmViewport}
    whileInView={fmAnimate}
  >
    <FirstValidImage
      className="mb-4 max-h-28 w-1/2 object-cover md:mb-6 md:h-48 md:max-h-full md:w-full"
      images={testimonial.images?.objects}
    />
    <h3 className="text-2xl font-semibold md:text-3xl">{testimonial.title}</h3>
    <p className="text-base font-semibold uppercase text-gray-600 md:h-8 md:text-lg">
      {testimonial.industry}
    </p>
    <p className="text-center md:text-left">{testimonial.description}</p>
    {testimonial.external_id && (
      <Link className="my-4" href={`/customers/${testimonial.external_id}`}>
        <Button variant="secondary">{`Read more`}</Button>
      </Link>
    )}
  </motion.div>
);
