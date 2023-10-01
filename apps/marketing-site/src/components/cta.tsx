import clsx from "clsx";
import { motion } from "framer-motion";
import {
  fmAnimate,
  fmFromBelowInitial,
  fmFromLeftInitial,
  fmFromRightInitial,
  fmTransition,
  fmViewport,
} from "src/utils/framerMotionVariants";
import {
  CallToAction,
  CallToActionAppearance,
  CallToActionType,
} from "../../types/gql";
import { CopyComponent } from "./copy";
import { Button, ButtonVariant } from "./button";

interface CTAProps {
  cta: CallToAction;
}

const actionCTA = (cta: CallToAction) => {
  const type = cta.type as CallToActionType;

  if (type === CallToActionType.ScrollToId && cta.scroll_to_id) {
    const element = document.getElementById(cta.scroll_to_id);
    element?.scrollIntoView({ behavior: "smooth" });
  }
};

export const CTAButton = ({
  cta,
  variant,
}: CTAProps & { variant: ButtonVariant }) => (
  <Button variant={variant} onClick={() => actionCTA(cta)}>
    {cta.button_text || "CTA"}
  </Button>
);

export const CTAComponent = ({ cta }: CTAProps) => {
  const hasText = Boolean(cta.copy);
  const { appearance } = cta as { appearance: CallToActionAppearance };

  const isIsland = appearance === CallToActionAppearance.Island;

  const ctaInitial = hasText ? fmFromRightInitial : fmFromBelowInitial;

  return (
    <motion.div
      className={clsx(
        "flex flex-col items-center gap-8 px-8 py-10 text-white md:flex-row md:px-16 lg:px-20",
        appearance === CallToActionAppearance.Banner &&
          "w-full bg-skylark-darkblue",
        isIsland && "my-4 w-11/12 rounded-2xl bg-skylark-blue shadow md:my-10",
        hasText ? "justify-between text-left" : "justify-center text-center",
      )}
      initial={isIsland && fmFromLeftInitial}
      transition={fmTransition}
      viewport={fmViewport}
      whileInView={isIsland ? fmAnimate : undefined}
    >
      {hasText && (
        <motion.div
          className="max-w-4xl"
          initial={!isIsland && fmFromLeftInitial}
          transition={fmTransition}
          viewport={fmViewport}
          whileInView={!isIsland ? fmAnimate : undefined}
        >
          <CopyComponent copy={cta.copy} />
        </motion.div>
      )}
      <motion.div
        initial={!isIsland && ctaInitial}
        transition={fmTransition}
        viewport={fmViewport}
        whileInView={!isIsland ? fmAnimate : undefined}
      >
        <CTAButton cta={cta} variant="tertiary" />
      </motion.div>
    </motion.div>
  );
};
