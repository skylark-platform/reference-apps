import { InlineWidget } from "react-calendly";
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
    <div className="-mt-10 h-[1200px] w-full lg:h-[850px]" id="calendly">
      {type === EmbedType.Calendly && embed.embed_id && (
        <InlineWidget
          styles={{ height: "100%", marginBottom: 40 }}
          url={embed.embed_id}
        />
      )}
    </div>
  );
};
