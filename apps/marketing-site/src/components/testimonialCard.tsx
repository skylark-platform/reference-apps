import { Testimonial } from "../../types/gql";
import { FirstValidImage } from "./image";

export interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard = ({ testimonial }: TestimonialCardProps) => (
  <div className="flex w-full max-w-md flex-col items-start">
    <FirstValidImage
      className="mb-6 h-48 w-full object-cover"
      images={testimonial.images?.objects}
    />
    <h3 className="text-3xl font-semibold">{testimonial.title}</h3>
    <p className="h-8 text-lg font-semibold uppercase text-gray-600">
      {testimonial.industry}
    </p>
    <p>{testimonial.description}</p>
  </div>
);
