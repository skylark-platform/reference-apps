import { InlineWidget } from "react-calendly";
import { motion } from "framer-motion";
import {
  fmTransition,
  fmViewport,
  fmAnimate,
  fmFromBelowInitial,
} from "src/utils/framerMotionVariants";
import { Embed, EmbedType } from "../../types/gql";

interface EmbedComponentProps {
  embed: Embed;
}

export const EmbedComponent = ({ embed }: EmbedComponentProps) => {
  const type = embed.type as EmbedType;

  if (!embed || !type) {
    return <></>;
  }

  return (
    <div className="w-full bg-gray-100 lg:h-[850px]" id="calendly">
      <motion.div
        className="-mt-10 h-[1200px] w-full"
        initial={fmFromBelowInitial}
        transition={fmTransition}
        viewport={fmViewport}
        whileInView={fmAnimate}
      >
        {type === EmbedType.Calendly && embed.embed_id && (
          <InlineWidget
            styles={{ height: "100%", marginBottom: 40 }}
            url={embed.embed_id}
          />
        )}
      </motion.div>
    </div>
  );
};
