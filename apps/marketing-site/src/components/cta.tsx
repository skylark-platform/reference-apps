import clsx from "clsx";
import { CallToAction, CallToActionAppearance } from "../../types/gql";
import { CopyComponent } from "./copy";

interface CTAProps {
  cta: CallToAction;
}

export const CTAComponent = ({ cta }: CTAProps) => {
  const hasText = Boolean(cta.copy);
  const { appearance } = cta as { appearance: CallToActionAppearance };

  return (
    <div
      className={clsx(
        "gutter flex items-center gap-4 bg-skylark-darkblue py-10 text-white",
        appearance === CallToActionAppearance.Banner && "w-full",
        appearance === CallToActionAppearance.Island && "w-11/12 rounded-2xl",
        hasText ? "justify-between text-left" : "justify-center text-center",
      )}
    >
      {hasText && (
        <div className="max-w-4xl">
          <CopyComponent copy={cta.copy} />
        </div>
      )}
      <div className="">
        <button className="rounded-full bg-white px-14 py-2 text-black">{`CTA`}</button>
      </div>
    </div>
  );
};
