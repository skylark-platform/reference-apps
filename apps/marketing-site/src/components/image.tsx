import clsx from "clsx";
import { Maybe, SkylarkImage } from "../../types/gql";

export const FirstValidImage = ({
  images,
  className,
}: {
  images?:
    | SkylarkImage[]
    | Maybe<SkylarkImage[]>
    | Maybe<Maybe<SkylarkImage>[]>;
  className?: string;
}) => {
  const image = images?.find((img) => !!img?.url);

  if (!image || !image?.url) {
    return <></>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={image.title || image.uid}
      className={clsx("rounded-lg shadow", className)}
      src={image.url}
    />
  );
};
